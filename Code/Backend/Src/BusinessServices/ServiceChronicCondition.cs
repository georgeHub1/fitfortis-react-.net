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
    public class ServiceChronicCondition : BaseService, IServiceChronicCondition
    {
        private readonly IRepositoryChronicCondition _repositoryChronicCondition;
        private readonly IRepositoryUserCondition _repositoryUserCondition;
        private readonly IRepositoryUser _repositoryUser;
        private readonly IRepositoryEncyclopediaEntity _repositoryEncyclopedia;

        public ServiceChronicCondition(IRepositoryChronicCondition repositoryChronicCondition, IRepositoryUserCondition repositoryUserCondition, IRepositoryUser repositoryUser,
            IRepositoryEncyclopediaEntity repositoryEncyclopedia)
        {
            _repositoryUserCondition = repositoryUserCondition;
            _repositoryChronicCondition = repositoryChronicCondition;
            _repositoryUser = repositoryUser;
            _repositoryEncyclopedia = repositoryEncyclopedia;
        }

        public async Task<ServiceResponse<UserCondition>> AddUserCondition(IServiceRequest request, Guid userId, KeysData<Guid> chronicConditionIds)
        {
            return await ExecuteAsync(() =>
            {
                List<UserCondition> resultList = new List<UserCondition>();

                foreach (var key in chronicConditionIds.Keys)
                {
                    var entity = new UserCondition
                    {
                        UserId = userId,
                        ChronicConditionId = key
                    };

                    resultList.Add(entity);

                    _repositoryUserCondition.Create(entity);
                }

                _repositoryUserCondition.Save();

                return new ServiceResponse<UserCondition>(resultList, resultList.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ProfileCommonResult>> GetUserConditions(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var user = _repositoryUser.SelectById(userId);

                var selectedConditionIds = _repositoryUserCondition.GetConditionForUser(userId).Select(it => it.ChronicConditionId).ToList();
                var chronicConditions = _repositoryChronicCondition.GetChronicConditions(user.SexAtBirth).ToList();
                var encyclopedia = _repositoryEncyclopedia.SelectAllByIdsSql(chronicConditions.Select(it => it.EncyclopediaId).ToArray()).ToDictionary(it => it.Id, it => it);

                var data = chronicConditions
                    .Select(it =>
                        new ProfileCommonResult
                        {
                            Id = it.Id,
                            Key = it.Category.ToString(),
                            Category = ResourceStringExctractor.GetLocalizedString(it.Category.ToString(), language),
                            Name = encyclopedia.ContainsKey(it.EncyclopediaId) ? encyclopedia[it.EncyclopediaId].GetTitle(language) : string.Empty, 
                            Description = encyclopedia.ContainsKey(it.EncyclopediaId) ? encyclopedia[it.EncyclopediaId].GetDescription(language) : string.Empty,
                            IsSelected = selectedConditionIds.Contains(it.Id),
                            EncyclopediaId = it.EncyclopediaId,
                            HealthIndexAmount = it.HealthIndexAmount
                        }).ToList();

                var count = data.Count;

                return new ServiceResponse<ProfileCommonResult>(data, count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserCondition>> RemoveUserConditions(IServiceRequest request, Guid userId, KeysData<Guid> chronicConditionIds)
        {
            return await ExecuteAsync(() =>
            {
                var chronicConditions = _repositoryUserCondition.GetUserConditionsByConditions(userId, chronicConditionIds.Keys).ToList();
                foreach (var chronicCondition in chronicConditions)
                {
                    _repositoryUserCondition.Delete(chronicCondition.Id);
                }
                
                _repositoryUserCondition.Save();

                return new ServiceResponse<UserCondition>(chronicConditions, chronicConditions.Count);
            }).ConfigureAwait(false);
        }
    }
}
