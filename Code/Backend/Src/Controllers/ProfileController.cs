using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class ProfileController : BaseApiController
    {
        private readonly IServiceAudit _serviceAudit;
        private readonly IServiceChronicCondition _serviceChronicCondition;
        private readonly IServiceFamilyHistory _serviceFamilyHistory;
        private readonly IServiceUser _serviceUser;
        private readonly IBlobService _blobService;
        private readonly IServiceVaccineTherapy _serviceVaccineTherapy;
        private readonly UserManager<User> _userManager;

        public ProfileController(UserManager<User> userManager, IServiceAudit serviceAudit, IServiceChronicCondition serviceChronicCondition,
            IServiceFamilyHistory serviceFamilyHistory, IServiceUser serviceUser, IBlobService blobService,
            IServiceVaccineTherapy serviceVaccineTherapy)
        {
            _serviceAudit = serviceAudit;
            _serviceChronicCondition = serviceChronicCondition;
            _serviceFamilyHistory = serviceFamilyHistory;
            _serviceUser = serviceUser;
            _userManager = userManager;
            _blobService = blobService;
            _serviceVaccineTherapy = serviceVaccineTherapy;
        }

        [HttpGet("account/me")]
        public async Task<IActionResult> Me(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ShortUser, ModelShortUser>(
                ApiOperationType.RegisterConfirm, apiRequest,
                async request =>
                {
                    var user = await _userManager.GetUserAsync(HttpContext.User).ConfigureAwait(false);
                    var result = await _userManager.GetRolesAsync(user).ConfigureAwait(false);
                    var role = result.FirstOrDefault() ?? Constants.UserRole;

                    return new ServiceResponse<ShortUser>(new ShortUser
                    {
                        FirstName = user.FirstName,
                        LastName = user.LastName,
                        Email = user.Email,
                        DateOfBirth = user.DateOfBirth,
                        LanguageCode = user.Language,
                        AvatarId = user.AvatarId,
                        UserId = user.Id,
                        SexAtBirth = user.SexAtBirth,
                        Role = role
                    });
                }, useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("activity/user/{userId:Guid}")]
        public async Task<IActionResult> GetUserActivity(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Audit, ModelAudit>(
                ApiOperationType.GetUserActivity,
                apiRequest,
                async request => await _serviceAudit.GetUserActivity(request, userId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpDelete("avatar/user/{userId:Guid}")]
        public async Task<IActionResult> DeleteAvatar(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, User, ModelUser>(
                ApiOperationType.DeleteUserAvatar,
                apiRequest,
                async request =>
                {
                    var user = await _serviceUser.GetUserById(request, userId).ConfigureAwait(false);
                    if (user.Item.AvatarId.HasValue)
                    {
                        await _blobService.RemoveFileAsync(AttachmentType.Avatar, user.Item.AvatarId.Value).ConfigureAwait(false);
                    }

                    return user;
                }).ConfigureAwait(false);
        }

        [HttpPost("avatar/user/{userId:Guid}/upload")]
        public async Task<IActionResult> UploadUserAvatar(Guid userId, [FromForm] ModelUploadFile fileRequest)
        {
            var apiRequest = new ModelApiServiceRequest<ModelUploadFile> { Data = fileRequest };
            return await ExecuteServiceAsync<ModelUploadFile, UploadFile, User, ModelUser>(
                ApiOperationType.UploadAvatar,
                apiRequest,
                async request =>
                {
                    var user = await _serviceUser.GetUserById(request, userId).ConfigureAwait(false);

                    if (user.Item.AvatarId.HasValue)
                    {
                        await _blobService.RemoveFileAsync(AttachmentType.Avatar, user.Item.AvatarId.Value).ConfigureAwait(false);
                    }

                    var result = await _blobService.UploadFileAsync(AttachmentType.Avatar, request.Data.File, userId).ConfigureAwait(false);

                    return await _serviceUser.UpdateAvatarId(request, userId, result.Item.Id).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpGet("avatar/user/{userId:Guid}/download")]
        public async Task<FileContentResult> DownloadAvatar(Guid userId)
        {
            var user = await _serviceUser.GetUserById(null, userId).ConfigureAwait(false);
            var userResult = user.Item;

            var request = userResult.AvatarId.HasValue 
                ?  await _blobService.DownloadFileAsync(AttachmentType.Avatar, userResult.AvatarId.Value).ConfigureAwait(false) 
                :  await _blobService.DownloadFileAsync(AttachmentType.Avatar, new Guid(Constants.SystemAvatarId), Constants.SystemFolder).ConfigureAwait(false);

            var result = request.Item;

            var contentType = new MediaTypeHeaderValue(result.ContentType).ToString();
            var fileBytes = result.Stream.GetBuffer();

            return new FileContentResult(fileBytes, contentType)
            {
                FileDownloadName = result.FileName
            };
        }

        [HttpGet("controlcheckup/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserControlCheckups(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ShortControlCheckup, ModelShortControlCheckup>(
                ApiOperationType.GetUserControlCheckups,
                apiRequest,
                async request => await _serviceUser.GetUserControlCheckups(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("chroniccondition/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserConditions(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ProfileCommonResult, ModelProfileCommonResult>(
                ApiOperationType.GetUserConditions,
                apiRequest,
                async request => await _serviceChronicCondition.GetUserConditions(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("familyhistory/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserFamilyHistory(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ProfileCommonResult, ModelProfileCommonResult>(
                ApiOperationType.GetUserFamilyHistory,
                apiRequest,
                async request => await _serviceFamilyHistory.GetUserFamilyHistory(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("therapyandvaccine/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserTherapiesAndVaccines(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ProfileCommonResult, ModelProfileCommonResult>(
                ApiOperationType.GetTherapiesVaccines,
                apiRequest,
                async request => await _serviceVaccineTherapy.GetUserVaccineAndTherapies(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("basicinformation/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserBasicInformation(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ProfileCommonResult, ModelProfileCommonResult>(
                ApiOperationType.GetUserBasicInfo,
                apiRequest,
                async request => await _serviceUser.GetBasicInformationForUser(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("lifestyle/user/{userId:guid}/lang/{languageCode}")]
        public async Task<IActionResult> GetUserLifestyle(Guid userId, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ProfileCommonResult, ModelProfileCommonResult>(
                ApiOperationType.GetUserLifestyle,
                apiRequest,
                async request => await _serviceUser.GetLifestyleInformationForUser(request, userId, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost("chroniccondition/user/{userId:guid}")]
        public async Task<IActionResult> AddChronicCondition(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserCondition, ModelUserCondition>(
                ApiOperationType.CreateChronicConditions,
                apiRequest,
                async request => await _serviceChronicCondition.AddUserCondition(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("familyhistory/user/{userId:Guid}")]
        public async Task<IActionResult> AddUserFamilyHistory(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserFamilyHistory, ModelUserFamilyHistory>(
                ApiOperationType.AddUserFamilyHistory,
                apiRequest,
                async request => await _serviceFamilyHistory.AddUserFamilyHistory(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("therapyandvaccine/user/{userId:Guid}")]
        public async Task<IActionResult> AddUserTherapy(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserVaccineTherapy, ModelUserVaccineTherapy>(
                ApiOperationType.AddUserTherapy,
                apiRequest,
                async request => await _serviceVaccineTherapy.AddUserVaccineAndTherapies(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("basicinformation/user/{userId:Guid}")]
        public async Task<IActionResult> UpdateBasicInformation(Guid userId, [FromBody]ModelApiServiceRequest<ModelUpdateBasicInformation> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateBasicInformation, UpdateBasicInformation, User, ModelUser>(
                ApiOperationType.UpdateBasicInformation,
                apiRequest,
                async request => await _serviceUser.UpdateUserBasicInformation(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("lifestyle/user/{userId:Guid}")]
        public async Task<IActionResult> UpdateLifestyle(Guid userId, [FromBody]ModelApiServiceRequest<ModelUpdateLifestyle> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateLifestyle, UpdateLifestyle, User, ModelUser>(
                ApiOperationType.UpdateLifestyle,
                apiRequest,
                async request => await _serviceUser.UpdateUserLifestyle(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("chroniccondition/user/{userId:guid}")]
        public async Task<IActionResult> RemoveChronicCondition(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserCondition, ModelUserCondition>(
                ApiOperationType.RemoveUserCondition,
                apiRequest,
                async request => await _serviceChronicCondition.RemoveUserConditions(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("familyhistory/user/{userId:Guid}")]
        public async Task<IActionResult> DeleteUserFamilyHistory(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserFamilyHistory, ModelUserFamilyHistory>(
                ApiOperationType.DeleteUserFamilyHistory,
                apiRequest,
                async request => await _serviceFamilyHistory.RemoveUserFamilyHistory(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("therapyandvaccine/user/{userId:Guid}")]
        public async Task<IActionResult> DeleteUserUserVaccine(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, UserVaccineTherapy, ModelUserVaccineTherapy>(
                ApiOperationType.DeleteUserVaccine,
                apiRequest,
                async request => await _serviceVaccineTherapy.RemoveUserVaccineAndTherapies(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

    }
}
