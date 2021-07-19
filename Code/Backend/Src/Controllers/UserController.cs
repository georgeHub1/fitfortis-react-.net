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
    /// <summary>
    ///     API controller for User
    /// </summary>
    /// <seealso cref="BaseApiController" />
    [Route(Constants.DefaultControllerRoute)]
    public class UserController : BaseApiController
    {
        private readonly IServiceUser _userService;

        
        public UserController(IServiceUser userService)
        {
            _userService = userService;
        }

        [HttpGet]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> GetAllUsers(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.GetUserList,
                apiRequest,
                async request => await _userService.GetAllUsers(request).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetUserById(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.GetUserById,
                apiRequest,
                async request => await _userService.GetUserById(request, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}/healthindex")]
        public async Task<IActionResult> GetUserHealthIndex(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, HealthIndexDetails, ModelHealthIndexDetails>(
                ApiOperationType.GetUserHealthIndex,
                apiRequest,
                async request => await _userService.GetUserHealthIndex(request, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateUser(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateUser> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateUser, UpdateUser, User, ModelUser>(
                ApiOperationType.UpdateUser,
                apiRequest,
                async request => await _userService.UpdateUser(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> Delete(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.DeleteUser,
                apiRequest,
                async request => await _userService.DeleteUser(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
