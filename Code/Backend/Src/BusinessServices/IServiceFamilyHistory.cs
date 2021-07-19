using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceFamilyHistory 
    {
        Task<ServiceResponse<ProfileCommonResult>> GetUserFamilyHistory(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<UserFamilyHistory>> AddUserFamilyHistory(IServiceRequest request, Guid userId, KeysData<Guid> familyHistoryIds);
        Task<ServiceResponse<UserFamilyHistory>> RemoveUserFamilyHistory(IServiceRequest request, Guid userId, KeysData<Guid> familyHistoryIds);
    }
}
