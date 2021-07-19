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
    public class ServiceFamilyHistory : BaseService, IServiceFamilyHistory
    {
        private readonly IRepositoryUserFamilyHistory _repositoryUserFamilyHistory;
        private readonly IRepositoryFamilyHistory _repositoryFamilyHistory;

        public ServiceFamilyHistory(IRepositoryUserFamilyHistory repositoryUserFamilyHistory, IRepositoryFamilyHistory repositoryFamilyHistory)
        {
            _repositoryUserFamilyHistory = repositoryUserFamilyHistory;
            _repositoryFamilyHistory = repositoryFamilyHistory;
        }

        public async Task<ServiceResponse<ProfileCommonResult>> GetUserFamilyHistory(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var assignedItems = _repositoryUserFamilyHistory.GetUserFamilyHistory(userId).Select(it => it.FamilyHistoryId).ToList();

                var familyHistory = _repositoryFamilyHistory.GetUserFamilyHistory().Select(it => new ProfileCommonResult
                {
                    Id = it.Id,
                    Key = it.Category.ToString(),
                    Category = ResourceStringExctractor.GetLocalizedString(it.Category.ToString(), language),
                    Name = it.Encyclopedia.GetTitle(language),
                    Description = it.Encyclopedia.GetDescription(language),
                    IsSelected = assignedItems.Contains(it.Id),
                    EncyclopediaId = it.EncyclopediaId,
                    HealthIndexAmount = it.HealthIndexAmount
                });

                var count = familyHistory.Count();

                return new ServiceResponse<ProfileCommonResult>(familyHistory.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserFamilyHistory>> AddUserFamilyHistory(IServiceRequest request, Guid userId, KeysData<Guid> familyHistoryIds)
        {
            return await ExecuteAsync(() =>
            {
                List<UserFamilyHistory> resultList = new List<UserFamilyHistory>();

                foreach (var key in familyHistoryIds.Keys)
                {
                    var entity = new UserFamilyHistory
                    {
                        UserId = userId,
                        FamilyHistoryId = key,
                        Date = DateTime.UtcNow
                    };

                    resultList.Add(entity);

                    _repositoryUserFamilyHistory.Create(entity);
                }

                _repositoryUserFamilyHistory.Save();

                return new ServiceResponse<UserFamilyHistory>(resultList, resultList.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserFamilyHistory>> RemoveUserFamilyHistory(IServiceRequest request, Guid userId, KeysData<Guid> familyHistoryIds)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryUserFamilyHistory.GetFamilyHistoryByHistoryIds(userId, familyHistoryIds.Keys).ToList();
                foreach (var key in data)
                {
                    _repositoryUserFamilyHistory.Delete(key.Id);
                }

                _repositoryUserFamilyHistory.Save();

                return new ServiceResponse<UserFamilyHistory>(data, data.Count);
            }).ConfigureAwait(false);
        }
    }
}
