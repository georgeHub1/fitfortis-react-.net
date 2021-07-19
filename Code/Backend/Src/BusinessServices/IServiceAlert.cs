using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceAlert
    {
        Task<ServiceResponse<Alert>> GetAlerts(IServiceRequest request);
        Task<ServiceResponse<AlertDetails>> GetActiveUserAlerts(IServiceRequest request, Guid userId, string languageCode);
        Task<ServiceResponse<UserAlert>> GetAllUserAlerts(IServiceRequest request, Guid userId);

        Task<ServiceResponse<Alert>> CreateAlert(IServiceRequest request, Alert alert);
        Task<ServiceResponse<Alert>> UpdateAlert(IServiceRequest request, Guid alertId, UpdateAlert alert);
        Task<ServiceResponse<Alert>> RemoveAlert(IServiceRequest request, Guid alertId);
    }
}
