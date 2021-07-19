using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceChronicCondition 
    {
        Task<ServiceResponse<UserCondition>> AddUserCondition(IServiceRequest request, Guid userId, KeysData<Guid> chronicConditionIds);
        Task<ServiceResponse<ProfileCommonResult>> GetUserConditions(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<UserCondition>> RemoveUserConditions(IServiceRequest request, Guid userId, KeysData<Guid> chronicConditionIds);

    }
}
