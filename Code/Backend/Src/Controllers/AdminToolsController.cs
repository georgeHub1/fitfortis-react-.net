using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    [Authorize(Roles = Constants.AdminRole)]
    public class AdminToolsController : BaseApiController
    {
        private readonly RoleManager<Role> _roleManager;
        private readonly UserManager<User> _userManager;
        private readonly IServiceNews _serviceNews;
        private readonly IBlobService _blobService;
        private readonly IServiceAlert _serviceAlert;
        private readonly IServiceAnalytic _serviceAnalytic;

        public AdminToolsController(RoleManager<Role> roleManager, UserManager<User> userManager, IServiceNews serviceNews,
            IBlobService blobService, IServiceAlert serviceAlert, IServiceAnalytic serviceAnalytic)
        {
            _roleManager = roleManager;
            _userManager = userManager;
            _serviceNews = serviceNews;
            _blobService = blobService;
            _serviceAlert = serviceAlert;
            _serviceAnalytic = serviceAnalytic;
        }

        [HttpGet("role")]
        public async Task<IActionResult> GetAllRoles(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Role, ModelRole>(
                ApiOperationType.GetAllRoles,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.GetUserAsync(HttpContext.User).ConfigureAwait(false);
                    var result = _roleManager.Roles.ToList();

                    return new ServiceResponse<Role>(result, result.Count);
                }).ConfigureAwait(false);
        }

        [HttpGet("role/user/{userId}")]
        public async Task<IActionResult> GetUserRoles(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Role, ModelRole>(
                ApiOperationType.GetUserRoles,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByIdAsync(userId.ToString()).ConfigureAwait(false);
                    var result = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

                    return new ServiceResponse<Role>(result.Select(it => new Role{Name = it}).ToList(), result.Count);
                }).ConfigureAwait(false);
        }

        [HttpGet("role/{roleName}/user")]
        public async Task<IActionResult> GetRoleUsers(string roleName, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.GetRoleUsers,
                apiRequest,
                async request =>
                {
                    var users = await _userManager.GetUsersInRoleAsync(roleName).ConfigureAwait(false);

                    return new ServiceResponse<User>(users.ToList(), users.Count);
                }).ConfigureAwait(false);
        }

        [HttpGet("role/admin/user")]
        public async Task<IActionResult> GetAdminUsers(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.GetRoleUsers,
                apiRequest,
                async request =>
                {
                    var users = await _userManager.GetUsersInRoleAsync(Constants.AdminRole).ConfigureAwait(false);

                    return new ServiceResponse<User>(users.ToList(), users.Count);
                }).ConfigureAwait(false);
        }

        [HttpGet("news")]
        public async Task<IActionResult> GetAllNews(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, News, ModelNews>(
                ApiOperationType.GetNews,
                apiRequest,
                async request => await _serviceNews.GetNews(request).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("news/recyclebin")]
        public async Task<IActionResult> GetInactiveNews( ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, News, ModelNews>(
                ApiOperationType.GetInactiveNews,
                apiRequest,
                async request => await _serviceNews.GetInactiveNews(request).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("alert")]
        public async Task<IActionResult> GetAllAlerts(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Alert, ModelAlert>(
                ApiOperationType.GetAllAlerts,
                apiRequest,
                async request => await _serviceAlert.GetAlerts(request).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("analytic/lang/{languageCode}")]
        public async Task<IActionResult> GetAllAnalytic(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ShortAnalytic, ModelShortAnalytic>(
                ApiOperationType.GetAllAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.GetAllAnalytic(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("analytic/details/lang/{languageCode}")]
        public async Task<IActionResult> GetAnalyticDetails(string languageCode, ModelApiServiceRequest<ModelMetricDataQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetricDataQueryParams, MetricDataQueryParams, AnalyticDetails, ModelAnalyticDetails>(
                ApiOperationType.GetAnalyticDetails,
                apiRequest,
                async request => await _serviceAnalytic.GetAnalyticDetails(request, languageCode, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("analytic/{analyticId:Guid}")]
        public async Task<IActionResult> GetDataForAnalytic(Guid analyticId, ModelApiServiceRequest<ModelMetricDataQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetricDataQueryParams, MetricDataQueryParams, AnalyticData, ModelAnalyticData>(
                ApiOperationType.GetDataForAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.GetDataForAnalytic(request, analyticId, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost("analytic")]
        public async Task<IActionResult> AddAnalytic([FromBody]ModelApiServiceRequest<ModelAnalytic> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAnalytic, Analytic, Analytic, ModelAnalytic>(
                ApiOperationType.CreateAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.AddAnalytic(request, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost("analytic/details/lang/{languageCode}")]
        public async Task<IActionResult> AddActualAnalyticData(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, AnalyticDataDetails, ModelAnalyticDataDetails>(
                ApiOperationType.GetAllAnalyticDetails,
                apiRequest,
                async request => await _serviceAnalytic.GetAllAnalyticStatistic(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost("role")]
        public async Task<IActionResult> CreateRole([FromBody]ModelApiServiceRequest<ModelCreateRole> apiRequest)
        {
            return await ExecuteServiceAsync<ModelCreateRole, CreateRole, Role, ModelRole>(
                ApiOperationType.CreateRole,
                apiRequest,
                async request =>
                {
                    var role = new Role
                    {
                        Name = request.Data.Name
                    };

                    var result = await _roleManager.CreateAsync(role).ConfigureAwait(false);

                    if (!result.Succeeded)
                    {
                        var errors = result.Errors.Select(x => new ValidationError(x.Description, OperationErrorType.RoleCreationError)).ToArray();
                        throw new ValidationException(errors);
                    }

                    return new ServiceResponse<Role>(role);
                }).ConfigureAwait(false);
        }

        [HttpPost("system/upload")]
        public async Task<IActionResult> UploadSystemImage([FromForm] ModelUploadFile fileRequest)
        {
            var apiRequest = new ModelApiServiceRequest<ModelUploadFile> { Data = fileRequest };
            return await ExecuteServiceAsync<ModelUploadFile, UploadFile, FileUploadDetails, ModelFileUploadDetails>(
                ApiOperationType.UploadSystemImage,
                apiRequest,
                async request =>
                {
                    var fieldId = Guid.NewGuid();
                    var result = await _blobService.UploadFileAsync(AttachmentType.Avatar, request.Data.File, fieldId, Constants.SystemFolder).ConfigureAwait(false);

                    return result;
                }).ConfigureAwait(false);
        }

        [HttpPatch("analytic/{analyticId:Guid}")]
        public async Task<IActionResult> SetValueForAnalytic(Guid analyticId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, AnalyticData, ModelAnalyticData>(
                ApiOperationType.SetValueForAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.SetValueForAnalytic(request, analyticId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }


        [HttpPut("analytic/{analyticId:Guid}")]
        public async Task<IActionResult> UpdateAnalytic(Guid analyticId, [FromBody]ModelApiServiceRequest<ModelAnalytic> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAnalytic, Analytic, Analytic, ModelAnalytic>(
                ApiOperationType.UpdateAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.UpdateAnalytic(request, analyticId, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPut("news/restore")]
        public async Task<IActionResult> RestoreNews([FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, News, ModelNews>(
                ApiOperationType.RestoreNews,
                apiRequest,
                async request => await _serviceNews.RestoreNewsFromBin(request, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPut("news/{newsId:Guid}/inactivate")]
        public async Task<IActionResult> InactivateNews(Guid newsId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, News, ModelNews>(
                ApiOperationType.InactivateNews,
                apiRequest,
                async request => await _serviceNews.InactivateNews(request, newsId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpDelete("analytic/{analyticId:Guid}")]
        public async Task<IActionResult> DeleteAnalytic(Guid analyticId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Analytic, ModelAnalytic>(
                ApiOperationType.DeleteAnalytic,
                apiRequest,
                async request => await _serviceAnalytic.RemoveAnalytic(request, analyticId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpDelete("role/{roleName}")]
        public async Task<IActionResult> DeleteRole(string rolename, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Role, ModelRole>(
                ApiOperationType.DeleteRole,
                apiRequest,
                async request =>
                {
                    var role = await _roleManager.FindByNameAsync(rolename).ConfigureAwait(false);

                    if (role != null)
                    {
                        await _roleManager.DeleteAsync(role).ConfigureAwait(false);
                    }

                    return new ServiceResponse<Role>(role);
                }).ConfigureAwait(false);
        }

        [HttpPost("role/user")]
        public async Task<IActionResult> AddUserToRole([FromBody]ModelApiServiceRequest<ModelAddUserRole> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAddUserRole, AddUserRole, User, ModelUser>(
                ApiOperationType.AddUserToRole,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByIdAsync(request.Data.UserId.ToString()).ConfigureAwait(false);

                    await _userManager.AddToRoleAsync(user, request.Data.Role).ConfigureAwait(false);

                    return new ServiceResponse<User>(user);
                }).ConfigureAwait(false);
        }

        [HttpDelete("role/{roleName}/user/{userId:Guid}")]
        public async Task<IActionResult> DeleteUserFromRole(Guid userId, string roleName, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.DeleteUserFromRole,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByIdAsync(userId.ToString()).ConfigureAwait(false);

                    await _userManager.RemoveFromRoleAsync(user, roleName).ConfigureAwait(false);

                    return new ServiceResponse<User>(user);
                }).ConfigureAwait(false);
        }
    }
}
