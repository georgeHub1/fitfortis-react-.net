using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;
using Backend.Utility;
using OfficeOpenXml;

namespace Backend.BusinessServices
{
    public class ServiceEncyclopedia : BaseService, IServiceEncyclopedia
    {
        private readonly IRepositoryEncyclopediaEntity _repositoryEncyclopediaEntity;
        private readonly IRepositorySymptomChecker _repositorySymptomChecker;
        private readonly IRepositoryDrug _repositoryDrug;

        public ServiceEncyclopedia(IRepositoryEncyclopediaEntity repositoryEncyclopediaEntity, IRepositorySymptomChecker repositorySymptomChecker, IRepositoryDrug repositoryDrug)
        {
            _repositoryEncyclopediaEntity = repositoryEncyclopediaEntity;
            _repositorySymptomChecker = repositorySymptomChecker;
            _repositoryDrug = repositoryDrug;
        }

        public Task<ServiceResponse<StatusResult>> ImportEncyclopedia(IServiceRequest request, string path)
        {
            return ExecuteAsync(() =>
            {
                try
                {
                    var watch = Stopwatch.StartNew();

                    //ComplexImportEncyclopediaFromExcel(path);
                    ImportEncyclopediaDrugsFromExcel(path);

                    watch.Stop();

                    return new ServiceResponse<StatusResult>(new StatusResult {Status = ResultStatus.Success, Time = watch.Elapsed.ToString()});
                }
                catch (Exception)
                {
                    return new ServiceResponse<StatusResult>(new StatusResult {Status = ResultStatus.Failure});
                }
            });
        }


        public async Task<ServiceResponse<EncyclopediaEntity>> GetEncyclopediaById(IServiceRequest request, Guid id, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryEncyclopediaEntity.SelectById(id);
                entity.Description = entity.GetDescription(languageCode);
                entity.Title = entity.GetTitle(languageCode);

                var symptoms = _repositorySymptomChecker.GetSymptomsForEncyclopedia(id);
                var synonyms = _repositoryEncyclopediaEntity.GetSynonymsEntities(id.ToString());

                entity.Synonyms = synonyms.Select(it => it.GetTitle(languageCode)).ToList();
                entity.Symptoms = symptoms.Select(it => it.Symptom.GetTitle(languageCode)).ToList();
                entity.MetaTags = MetaTagsGenerator.GetMetaTags(entity.Title, entity.Description, Constants.DefaultFitFortisImage);

                return new ServiceResponse<EncyclopediaEntity>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchTerms>> GetEncyclopediaSearchTerms(IServiceRequest request, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryEncyclopediaEntity.SelectAll();

                List<SearchTerms> result = new List<SearchTerms>();
                if (languageCode.ToLowerInvariant() == Constants.Usa)
                {
                    result = data.Select(it => new SearchTerms { Id = !string.IsNullOrEmpty(it.OriginalEntryId) ? new Guid(it.OriginalEntryId) : it.Id, Title = it.TitleEnUs }).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.International)
                {
                    result = data.Select(it => new SearchTerms { Id = !string.IsNullOrEmpty(it.OriginalEntryId) ? new Guid(it.OriginalEntryId) : it.Id, Title = it.TitleEn }).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.Ukraine)
                {
                    result = data.Select(it => new SearchTerms { Id = !string.IsNullOrEmpty(it.OriginalEntryId) ? new Guid(it.OriginalEntryId) : it.Id, Title = it.TitleUkUa }).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.Bulgaria)
                {
                    result = data.Select(it => new SearchTerms { Id = !string.IsNullOrEmpty(it.OriginalEntryId) ? new Guid(it.OriginalEntryId) : it.Id, Title = it.TitleBgBg }).ToList();
                }

                var count = result.Count;

                return new ServiceResponse<SearchTerms>(result, count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchTerms>> GetEncyclopediaSearchTerms(IServiceRequest request, string languageCode, string searchKey)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryEncyclopediaEntity.SearchEncyclopedia(searchKey);

                List<SearchTerms> result = new List<SearchTerms>();

                foreach (var encyclopedia in data)
                {
                    result.Add(new SearchTerms
                    {
                        Id = !string.IsNullOrEmpty(encyclopedia.OriginalEntryId) ? new Guid(encyclopedia.OriginalEntryId) : encyclopedia.Id,
                        Title = encyclopedia.GetTitle(languageCode)
                    });
                }

                var count = result.Count;

                return new ServiceResponse<SearchTerms>(result.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<EncyclopediaEntity>> AddEncyclopediaItem(IServiceRequest request, EncyclopediaEntity encyclopedia)
        {
            return await ExecuteAsync(() =>
            {
                _repositoryEncyclopediaEntity.Create(encyclopedia);

                _repositoryEncyclopediaEntity.Save();

                return new ServiceResponse<EncyclopediaEntity>(encyclopedia);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<EncyclopediaEntity>> UpdateEncyclopediaItem(IServiceRequest request, Guid id, UpdateEncyclopediaEntity encyclopedia)
        {
            return await ExecuteAsync(() =>
            {
                var localEncyclopedia = _repositoryEncyclopediaEntity.SelectById(id);

                localEncyclopedia.MapChanges(encyclopedia);

                _repositoryEncyclopediaEntity.Update(localEncyclopedia);
                _repositoryEncyclopediaEntity.Save();

                return new ServiceResponse<EncyclopediaEntity>(localEncyclopedia);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<EncyclopediaEntity>> DeleteEncyclopediaItem(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var item = _repositoryEncyclopediaEntity.Delete(id);

                _repositoryEncyclopediaEntity.Save();

                return new ServiceResponse<EncyclopediaEntity>(item);
            }).ConfigureAwait(false);
        }

        private void ComplexImportEncyclopediaFromExcel(string path)
        {
            FileInfo file = new FileInfo(path);

            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets["Health"];
                int totalRows = worksheet.Dimension.Rows;
                int idCounter = 204;

                for (int i = 2; i < totalRows; i++)
                {
                    idCounter++;

                    string idBodySystem = null;
                    string idOriginalEntity = null;
                    var encyclopedia = new XxmImportModel
                    {
                        Title = worksheet.Cells[i, 2].Value?.ToString(),
                        Synonyms = worksheet.Cells[i, 3].Value?.ToString(),
                        ConciseDescription = worksheet.Cells[i, 4].Value?.ToString(),
                        OrganSystem = worksheet.Cells[i, 5].Value?.ToString(),
                    };

                    if (!string.IsNullOrEmpty(encyclopedia.OrganSystem))
                    {
                        idBodySystem = _repositoryEncyclopediaEntity.UpsertBodySystem(ref idCounter, encyclopedia.OrganSystem.Replace(", ", ",", StringComparison.InvariantCulture).Split(',').ToList());
                    }

                    if (!string.IsNullOrEmpty(encyclopedia.Title))
                    {
                        var existedId = string.IsNullOrEmpty(encyclopedia.Synonyms) ? null :_repositoryEncyclopediaEntity.SynonymIsPresent(encyclopedia.Synonyms.Replace(", ", ",", StringComparison.InvariantCulture).Split(',').ToList());
                        if (!string.IsNullOrEmpty(existedId))
                        {
                            UpsertSynonyms(ref idCounter, new List<string>{encyclopedia.Title}, idBodySystem, existedId);
                        }
                        else
                        {
                            idOriginalEntity = _repositoryEncyclopediaEntity.UpsertTitle(ref idCounter, encyclopedia.Title, encyclopedia.ConciseDescription, idBodySystem);
                        }
                    }

                    if (!string.IsNullOrEmpty(encyclopedia.Synonyms))
                    {
                        UpsertSynonyms(ref idCounter, encyclopedia.Synonyms.Replace(", ", ",", StringComparison.InvariantCulture).Split(',').ToList(), idBodySystem, idOriginalEntity);
                    }
                }
            }
        }

        private void ImportEncyclopediaDrugsFromExcel(string path)
        {
            FileInfo file = new FileInfo(path);
            var encyclopediaList = new List<Drug>();
            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets["Drugs"];
                int totalRows = worksheet.Dimension.Rows;
                int idCounter = 100000;

                for (int i = 2; i < totalRows; i++)
                {
                    idCounter++;

                    encyclopediaList.Add( new Drug()
                    {
                        Id = Guid.NewGuid().GenerateGuid(idCounter),
                        TitleEnUs = worksheet.Cells[i, 1].Value?.ToString(),
                        TitleEn = worksheet.Cells[i, 1].Value?.ToString(),
                        DescriptionEnUs = worksheet.Cells[i, 2].Value?.ToString()
                    });

                }

                _repositoryDrug.Create(encyclopediaList);
                _repositoryDrug.Save();
            }
        }

        private void UpsertSynonyms(ref int idCounter, List<string> synonyms, string bodySystemId, string originalId)
        {
            foreach (var synonym in synonyms.Where(it => !string.IsNullOrEmpty(it)))
            {
                var entity = _repositoryEncyclopediaEntity.GetByTitle(synonym);

                if (entity == null)
                {
                    _repositoryEncyclopediaEntity.Create(new EncyclopediaEntity
                    {
                        Id = Guid.NewGuid().GenerateGuid(idCounter),
                        TitleEnUs = synonym,
                        BodySystemId = bodySystemId,
                        OriginalEntryId = originalId
                    });

                    _repositoryEncyclopediaEntity.Save();

                    idCounter++;
                }
            }
        }
    }
}
