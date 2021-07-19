using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceVaccineTherapy : BaseService, IServiceVaccineTherapy
    {
        private readonly IRepositoryVaccineTherapy _repositoryVaccineTherapy;
        private readonly IRepositoryUserVaccineTherapy _repositoryUserVaccineTherapy;

        public ServiceVaccineTherapy(IRepositoryVaccineTherapy repositoryVaccineTherapy, IRepositoryUserVaccineTherapy repositoryUserVaccineTherapy)
        {
            _repositoryVaccineTherapy = repositoryVaccineTherapy;
            _repositoryUserVaccineTherapy = repositoryUserVaccineTherapy;
        }

        public async Task<ServiceResponse<ProfileCommonResult>> GetUserVaccineAndTherapies(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var userVaccinesIds = _repositoryUserVaccineTherapy.GetUserVaccineAndTherapies(userId).Select(it => it.VaccineTherapyId).ToList();


                var data = _repositoryVaccineTherapy.GeVaccineTherapies().Select(it => new ProfileCommonResult
                {
                    Id = it.Id,
                    Key = it.Category.ToString(),
                    Category = ResourceStringExctractor.GetLocalizedString(it.Category.ToString(), language),
                    Name = it.Encyclopedia.GetTitle(language),
                    Description = it.Encyclopedia.GetDescription(language),
                    IsSelected = userVaccinesIds.Contains(it.Id),
                    EncyclopediaId = it.EncyclopediaId,
                    HealthIndexAmount = it.HealthIndexAmount
                });


                var count = data.Count();

                return new ServiceResponse<ProfileCommonResult>(data.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserVaccineTherapy>> AddUserVaccineAndTherapies(IServiceRequest request, Guid userId, KeysData<Guid> vaccineIds)
        {
            return await ExecuteAsync(() =>
            {
                List<UserVaccineTherapy> resultList = new List<UserVaccineTherapy>();

                foreach (var key in vaccineIds.Keys)
                {
                    var entity = new UserVaccineTherapy
                    {
                        UserId = userId,
                        VaccineTherapyId = key,
                        Date = DateTime.UtcNow
                    };

                    resultList.Add(entity);

                    _repositoryUserVaccineTherapy.Create(entity);
                }

                _repositoryUserVaccineTherapy.Save();

                return new ServiceResponse<UserVaccineTherapy>(resultList, resultList.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserVaccineTherapy>> RemoveUserVaccineAndTherapies(IServiceRequest request, Guid userId, KeysData<Guid> vaccineIds)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryUserVaccineTherapy.GetUserVaccineTherapiesByIds(userId, vaccineIds.Keys).ToList();
                foreach (var key in data.ToList())
                {
                    _repositoryUserVaccineTherapy.Delete(key.Id);
                }

                _repositoryUserVaccineTherapy.Save();

                return new ServiceResponse<UserVaccineTherapy>(data, data.Count);
            }).ConfigureAwait(false);
        }
    }
}
