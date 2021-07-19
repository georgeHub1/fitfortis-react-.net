using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;
using Microsoft.EntityFrameworkCore.Design;

namespace Backend.BusinessServices
{
    public class ServiceMedicine : BaseService, IServiceMedicine
    {
        private readonly IRepositoryDrug _repositoryDrug;

        public ServiceMedicine(IRepositoryDrug repositoryDrug)
        {
            _repositoryDrug = repositoryDrug;
        }

        public async Task<ServiceResponse<Drug>> GetMedicineById(IServiceRequest request, Guid id, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryDrug.SelectById(id);
                entity.Description = entity.GetDescription(languageCode);
                entity.Title = entity.GetTitle(languageCode);

                return new ServiceResponse<Drug>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchTerms>> GetMedicineSearchTerms(IServiceRequest request, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDrug.SelectAll();

                List<SearchTerms> result = new List<SearchTerms>();
                if (languageCode.ToLowerInvariant() == Constants.Usa)
                {
                    result = data.Select(it => new SearchTerms {Id = it.Id, Title = it.TitleEnUs}).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.International)
                {
                    result = data.Select(it => new SearchTerms { Id = it.Id, Title = it.TitleEn }).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.Ukraine)
                {
                    result = data.Select(it => new SearchTerms { Id = it.Id, Title = it.TitleUkUa }).ToList();
                }
                if (languageCode.ToLowerInvariant() == Constants.Bulgaria)
                {
                    result = data.Select(it => new SearchTerms { Id = it.Id, Title = it.TitleBgBg }).ToList();
                }

                var count = result.Count;

                return new ServiceResponse<SearchTerms>(result, count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Drug>> AddMedicineItem(IServiceRequest request, Drug medicine)
        {
            return await ExecuteAsync(() =>
            {
                _repositoryDrug.Create(medicine);

                _repositoryDrug.Save();

                return new ServiceResponse<Drug>(medicine);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Drug>> UpdateMedicineItem(IServiceRequest request, Guid id, UpdateEncyclopediaEntity encyclopedia)
        {
            return await ExecuteAsync(() =>
            {
                var localMedicine = _repositoryDrug.SelectById(id);

                localMedicine.MapChanges(encyclopedia);

                _repositoryDrug.Update(localMedicine);
                _repositoryDrug.Save();

                return new ServiceResponse<Drug>(localMedicine);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Drug>> DeleteMedicineItem(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var item = _repositoryDrug.Delete(id);

                _repositoryDrug.Save();

                return new ServiceResponse<Drug>(item);
            }).ConfigureAwait(false);
        }
    }
}
