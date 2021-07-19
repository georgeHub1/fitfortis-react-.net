using System;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class AlertController : BaseApiController
    {
        private readonly IServiceAlert _serviceAlert;

        public AlertController(IServiceAlert serviceAlert)
        {
            _serviceAlert = serviceAlert;
        }

        [HttpGet("user/{userId:Guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetActiveUserAkerts(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, AlertDetails, ModelAlertDetails>(
                ApiOperationType.GetActiveUserAlerts,
                apiRequest,
                async request => await _serviceAlert.GetActiveUserAlerts(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("user/{userId:Guid}")]
        public async Task<IActionResult> GetAllUserAkerts(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, UserAlert, ModelUpdateAlert>(
                ApiOperationType.GetAllUserAlerts,
                apiRequest,
                async request => await _serviceAlert.GetAllUserAlerts(request, userId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> CreateAlert([FromBody]ModelApiServiceRequest<ModelAlert> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAlert, Alert, Alert, ModelAlert>(
                ApiOperationType.CreateAlert,
                apiRequest,
                async request => await _serviceAlert.CreateAlert(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{alertId:Guid}")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> UpdateAlert(Guid alertId, [FromBody]ModelApiServiceRequest<ModelUpdateAlert> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateAlert, UpdateAlert, Alert, ModelAlert>(
                ApiOperationType.UpdateAlert,
                apiRequest,
                async request => await _serviceAlert.UpdateAlert(request, alertId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{alertId:Guid}")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> DeleteAlert(Guid alertId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Alert, ModelAlert>(
                ApiOperationType.DeleteAlert,
                apiRequest,
                async request => await _serviceAlert.RemoveAlert(request, alertId).ConfigureAwait(false)).ConfigureAwait(false);
        }

    }
}
