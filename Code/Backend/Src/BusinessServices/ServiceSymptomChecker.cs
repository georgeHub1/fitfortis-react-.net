using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceSymptomChecker : BaseService, IServiceSymptomChecker
    {
        private readonly IRepositorySymptomChecker _repositorySymptomChecker;
        private readonly IRepositoryEncyclopediaEntity _repositoryEncyclopedia;


        public ServiceSymptomChecker(IRepositorySymptomChecker repositorySymptomChecker, IRepositoryEncyclopediaEntity repositoryEncyclopedia)
        {
            _repositorySymptomChecker = repositorySymptomChecker;
            _repositoryEncyclopedia = repositoryEncyclopedia;
        }

        public async Task<ServiceResponse<SymptomDetails>> GetSymptomDetails(IServiceRequest request, string languageCode, SymptomCheckerQueryParams parameters)
        {
            return await ExecuteAsync(() =>
            {
                var symptoms = _repositorySymptomChecker.SelectAll().GroupBy(it => it.EncyclopediaEntryPossibleCauseOrDiagnosisId).ToList();
                var encyclopedia = _repositoryEncyclopedia.GetSynonyms(languageCode);
                //var diagnoses = _repositoryEncyclopedia.GetDiagnoses(symptoms.Select(it => it.Key.Value), languageCode);
                var diagnoses = _repositoryEncyclopedia.SelectAllByIdsSql(symptoms.Select(it => it.Key.Value).ToArray()).ToDictionary(it => it.Id, it => it);


                var result = symptoms.Select(it => new SymptomDetails
                {
                    Id = it.Key,
                    Title = diagnoses.ContainsKey(it.Key.Value) ? diagnoses[it.Key.Value].GetTitle(languageCode) : String.Empty,
                    ApplicableToFemalePregnant = it.FirstOrDefault().ApplicableToFemalePregnant,
                    ApplicableToMale = it.FirstOrDefault().ApplicableToMale,
                    ApplicableToFemale = it.FirstOrDefault().ApplicableToFemale,
                    MinAgeOfApplicability = it.FirstOrDefault().MinAgeOfApplicability,
                    MaxAgeOfApplicability = it.FirstOrDefault().MaxAgeOfApplicability,
                    Symptoms = encyclopedia.ContainsKey(it.Key.Value) ? encyclopedia[it.Key.Value].ToList() : new List<string>()
                });

                if (parameters.ApplicableToFemale.HasValue)
                {
                    result = result.Where(it => it.ApplicableToFemale == parameters.ApplicableToFemale);
                }

                if (parameters.ApplicableToFemalePregnant.HasValue)
                {
                    result = result.Where(it => it.ApplicableToFemalePregnant == parameters.ApplicableToFemalePregnant);
                }

                if (parameters.ApplicableToMale.HasValue)
                {
                    result = result.Where(it => it.ApplicableToMale == parameters.ApplicableToMale);
                }

                if (parameters.MinAgeOfApplicability.HasValue)
                {
                    result = result.Where(it => it.MinAgeOfApplicability >= parameters.MinAgeOfApplicability);
                }

                if (parameters.MaxAgeOfApplicability.HasValue)
                {
                    result = result.Where(it => it.MaxAgeOfApplicability <= parameters.MaxAgeOfApplicability);
                }

                return new ServiceResponse<SymptomDetails>(result.ToList(), result.Count());
            }).ConfigureAwait(false);
        }
    }
}
