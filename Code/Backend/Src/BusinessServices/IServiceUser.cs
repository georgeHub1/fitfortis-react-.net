using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceUser
    {
        Task<ServiceResponse<User>> GetAllUsers(IServiceRequest request);
        Task<ServiceResponse<User>> GetUserById(IServiceRequest request, Guid id, bool throwNotFound = true);
        Task<ServiceResponse<AnalyticUserSigninDetails>> GetUserSigninDetails(IServiceRequest request, MetricDataQueryParams queryParams);

        Task<ServiceResponse<User>> UpdateUser(IServiceRequest request, Guid id, UpdateUser data);
        Task<ServiceResponse<User>> UpdateUserBasicInformation(IServiceRequest request, Guid id, UpdateBasicInformation data);
        Task<ServiceResponse<User>> UpdateUserLifestyle(IServiceRequest request, Guid id, UpdateLifestyle data);
        Task<ServiceResponse<User>> DeleteUser(IServiceRequest request, Guid id);
        Task<ServiceResponse<User>> UpdateAvatarId(IServiceRequest request, Guid userId, Guid avatarId);
        Task<ServiceResponse<User>> UpdateConfirmationDate(IServiceRequest request, Guid userId, DateTime accountConfirmationDate);
        Task<ServiceResponse<AnalyticUserSignIn>> AddLoginToStat(IServiceRequest request, AnalyticUserSignIn loginStats);
        Task<ServiceResponse<AnalyticUserSignIn>> SetUserSessionDuration(IServiceRequest request, AnalyticUserSignIn loginStats);
        Task<ServiceResponse<ProfileCommonResult>> GetBasicInformationForUser(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<ProfileCommonResult>> GetLifestyleInformationForUser(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<HealthIndexDetails>> GetUserHealthIndex(IServiceRequest request, Guid userId);
        Task<ServiceResponse<ShortControlCheckup>> GetUserControlCheckups(IServiceRequest request, Guid userId, string language);




    }
}
