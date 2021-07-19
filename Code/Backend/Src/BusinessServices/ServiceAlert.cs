using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceAlert : BaseService, IServiceAlert
    {
        private readonly IRepositoryAlert _repositoryAlert;
        private readonly IRepositoryUserAlert _repositoryUserAlert;

        public ServiceAlert(IRepositoryAlert repositoryAlert, IRepositoryUserAlert repositoryUserAlert)
        {
            _repositoryUserAlert = repositoryUserAlert;
            _repositoryAlert = repositoryAlert;
        }

        public async Task<ServiceResponse<Alert>> GetAlerts(IServiceRequest request)
        {
            return await ExecuteAsync(() =>
            {
                var alerts = _repositoryAlert.SelectAll();

                var count = alerts.Count();

                var pagedData = alerts.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Alert>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AlertDetails>> GetActiveUserAlerts(IServiceRequest request, Guid userId, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var userAlerts = _repositoryUserAlert.GetAlertsForUser(userId);

                var filteredAlerts = userAlerts.Where(it => !it.Hide && it.SnoozeTill >= DateTime.UtcNow && it.Alert.ExecutionDate <= DateTime.Today);

                var count = filteredAlerts.Count();

                var pagedData = filteredAlerts.Select(request.Paging, request.Sorting);

                return new ServiceResponse<AlertDetails>(pagedData.Select(it => new AlertDetails
                {
                    Message = it.Alert.GetMessage(languageCode),
                    Id = it.Id,
                    IsRead = it.IsRead
                }).ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<UserAlert>> GetAllUserAlerts(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                var userAlerts = _repositoryUserAlert.GetAlertsForUser(userId);

                var count = userAlerts.Count();

                var pagedData = userAlerts.Select(request.Paging, request.Sorting);

                return new ServiceResponse<UserAlert>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Alert>> CreateAlert(IServiceRequest request, Alert alert)
        {
            return await ExecuteAsync(() =>
            {
                alert.CreationDate = DateTime.UtcNow;
                var newAlert = _repositoryAlert.Create(alert);

                _repositoryAlert.Save();

                return new ServiceResponse<Alert>(newAlert);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Alert>> UpdateAlert(IServiceRequest request, Guid alertId, UpdateAlert alert)
        {
            return await ExecuteAsync(() =>
            {
                var localAlert = _repositoryAlert.SelectById(alertId);

                localAlert.MapChanges(alert);
                _repositoryAlert.Update(localAlert);

                _repositoryAlert.Save();

                return new ServiceResponse<Alert>(localAlert);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Alert>> RemoveAlert(IServiceRequest request, Guid alertId)
        {
            return await ExecuteAsync(() =>
            {
                RemoveUserAlerts(alertId);

                var alert = _repositoryAlert.Delete(alertId);

                _repositoryAlert.Save();

                return new ServiceResponse<Alert>(alert);
            }).ConfigureAwait(false);
        }

        private void RemoveUserAlerts(Guid alertId)
        {
            foreach (var userAlert in _repositoryUserAlert.GetUserAlertsByAlertId(alertId).ToList())
            {
                _repositoryUserAlert.Delete(userAlert.Id);
            }

            _repositoryUserAlert.Save();
        }
    }
}
