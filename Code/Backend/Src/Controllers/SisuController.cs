using System;
using System.Collections.Generic;
using System.Globalization;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Extensions;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class SisuController : BaseApiController
    {
        private readonly SignInManager<User> _signInManager;
        private readonly UserManager<User> _userManager;
        private readonly IServiceEventProcessor _eventProcessorService;
        private readonly IServiceUser _serviceUser;

        public SisuController(
            UserManager<User> userManager,
            SignInManager<User> signInManager,
            IServiceEventProcessor eventProcessorService,
            IServiceUser serviceUser
        )
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _eventProcessorService = eventProcessorService;
            _serviceUser = serviceUser;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody]ModelApiServiceRequest<ModelUserLoginData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUserLoginData, UserLoginData, TokenResult, ModelTokenResult>(
                ApiOperationType.Login,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByEmailAsync(request.Data.Email).ConfigureAwait(false);
                    if (user == null)
                    {
                        throw new PermissionDeniedException();
                    }

                    var stat = new AnalyticUserSignIn
                    {
                        UserId = user.Id,
                        SignInDatetime = DateTime.UtcNow,
                        UserAgent = Request.Headers[Constants.UserAgentHeaderName]
                    };

                    // check if email has been confirmed
                    if (!user.EmailConfirmed)
                    {
                        // generate email confirmation token
                        var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                        // trigger event
                        await _eventProcessorService.OnRegistrationConfirmation(request, null, user.Id, emailConfirmationToken).ConfigureAwait(false);

                        stat.Status = LoginStatus.Unsuccessful;
                        await _serviceUser.AddLoginToStat(request, stat).ConfigureAwait(false);

                        throw new ValidationException(new ValidationError(OperationErrorType.EmailWasNotConfirmedYet));
                    }

                    var userRole = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

                    string token;
                    var result = await _signInManager.PasswordSignInAsync(request.Data.Email, request.Data.Password, false, false).ConfigureAwait(false);
                    if (result.Succeeded)
                    {
                        token = GenerateJwtToken(user, userRole.FirstOrDefault());
                        stat.Status = LoginStatus.Successful;
                        await _serviceUser.AddLoginToStat(request, stat).ConfigureAwait(false);
                    }
                    else
                    {
                        stat.Status = LoginStatus.Unsuccessful;
                        await _serviceUser.AddLoginToStat(request, stat).ConfigureAwait(false);
                        throw new WrongLoginInfoException();
                    }

                    return new ServiceResponse<TokenResult>(new TokenResult { Token = token });
                }).ConfigureAwait(false);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout([FromBody]ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, EmptyEntity, EmptyEntityModel>(
                ApiOperationType.Logout,
                apiRequest,
                async request =>
                {
                    await _signInManager.SignOutAsync().ConfigureAwait(false);
                    return  new ServiceResponse<EmptyEntity>();
                }).ConfigureAwait(false);
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody]ModelApiServiceRequest<ModelUserRegisterData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUserRegisterData, UserRegisterData, User, ModelUser>(
                ApiOperationType.Register,
                apiRequest,
                async request =>
                {
                    var user = new User
                    {
                        UserName = request.Data.Email,
                        Email = request.Data.Email,
                        FirstName = request.Data.FirstName,
                        LastName = request.Data.LastName,
                        CreateAccountDate = DateTime.UtcNow,
                        Language = request.Data.Language
                    };

                    var result = await _userManager.CreateAsync(user, request.Data.Password).ConfigureAwait(false);

                    if (result.Succeeded)
                    {
                        // generate email confirmation token
                        var emailConfirmationToken = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                        // trigger event
                        await _eventProcessorService.OnRegistrationConfirmation(request, null, user.Id, emailConfirmationToken).ConfigureAwait(false);

                        user.LastName = emailConfirmationToken; // delete me!
                    }
                    else
                    {
                        var errors = result.Errors.Select(x => new ValidationError(x.Description, OperationErrorType.UserRegistrationError)).ToArray();
                        throw new ValidationException(errors);
                    }

                    return new ServiceResponse<User>(user);
                }).ConfigureAwait(false);
        }

        [AllowAnonymous]
        [HttpPost("register/confirm")]
        public async Task<IActionResult> UserRegisterConfirmAsync([FromBody] ModelApiServiceRequest<ModelUserRegisterConfirmData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUserRegisterConfirmData, UserRegisterConfirmData, TokenResult, ModelTokenResult>(
                ApiOperationType.RegisterConfirm, apiRequest,
                async request =>
                {
                    var userId = request.Data.UserId;
                    string token;

                    var user = await _userManager.FindByIdAsync(userId.ToString()).ConfigureAwait(false);
                    if (user != null)
                    {
                        // check if email already confirmed
                        if (user.EmailConfirmed)
                        {
                            throw new ValidationException(new ValidationError(OperationErrorType.EmailAlreadyConfirmed));
                        }

                        // confirm email
                        var confirmEmailRes = await _userManager.ConfirmEmailAsync(user, request.Data.EmailConfirmationToken).ConfigureAwait(false);
                        if (!confirmEmailRes.Succeeded)
                        {
                            throw new ValidationException(confirmEmailRes.Errors.Select(x => new ValidationError(x.Description, OperationErrorType.Common)).ToArray());
                        }

                        await _serviceUser.UpdateConfirmationDate(null, userId, DateTime.UtcNow).ConfigureAwait(false);
                        var userRole = await _userManager.GetRolesAsync(user).ConfigureAwait(false);

                        // get token
                        await _signInManager.SignInAsync(user, false).ConfigureAwait(false);
                        token = GenerateJwtToken(user, userRole.FirstOrDefault());
                    }
                    else
                    {
                        throw new ValidationException(new ValidationError(OperationErrorType.EntityNotFound));
                    }

                    return new ServiceResponse<TokenResult>(new TokenResult { Token = token });
                }, useTransaction: true, requestUser: true).ConfigureAwait(false);
        }

        [AllowAnonymous]
        [HttpPost("register/confirm/resend")]
        public async Task<IActionResult> UserRegisterConfirmResendAsync([FromBody] ModelApiServiceRequest<ModelForgotUserPassword> apiRequest)
        {
            return await ExecuteServiceAsync<ModelForgotUserPassword, ForgotUserPassword, TokenResult, ModelTokenResult>(
                ApiOperationType.RegisterConfirmResend, apiRequest,
                async request =>
                {
                    var userMail = request.Data.Email;
                    string token;

                    var user = await _userManager.FindByEmailAsync(userMail.ToString()).ConfigureAwait(false);
                    if (user != null)
                    {
                        // check if email already confirmed
                        if (user.EmailConfirmed)
                        {
                            throw new ValidationException(new ValidationError(OperationErrorType.EmailAlreadyConfirmed));
                        }

                        // generate email confirmation token
                        token = await _userManager.GenerateEmailConfirmationTokenAsync(user).ConfigureAwait(false);

                        // trigger event
                        await _eventProcessorService.OnRegistrationConfirmation(request, null, user.Id, token).ConfigureAwait(false);
                    }
                    else
                    {
                        throw new ValidationException(new ValidationError(OperationErrorType.EntityNotFound));
                    }

                    return new ServiceResponse<TokenResult>(new TokenResult { Token = token });
                }).ConfigureAwait(false);
        }

        [AllowAnonymous]
        [HttpPost("password/forgot")]
        public async Task<IActionResult> ForgotUserPasswordAsync([FromBody] ModelApiServiceRequest<ModelForgotUserPassword> apiRequest)
        {
            return await ExecuteServiceAsync<ModelForgotUserPassword, ForgotUserPassword, User, ModelUser>(
                ApiOperationType.ForgotUserPassword,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByEmailAsync(request.Data.Email).ConfigureAwait(false);

                    if (user == null)
                    {
                        throw new NotExistedAccountException(ResourceStringExctractor.GetLocalizedString(OperationErrorType.AccounNotExist.ToString(), string.IsNullOrEmpty(request.Data.LanguageCode) ? "en-US"  : request.Data.LanguageCode));
                    }

                    var resetPasswordToken = await _userManager.GeneratePasswordResetTokenAsync(user).ConfigureAwait(false);

                    // trigger event
                    await _eventProcessorService.OnForgotUserPasswordAsync(request, null, user.Id, resetPasswordToken).ConfigureAwait(false);

                    return new ServiceResponse<User>(user);
                }).ConfigureAwait(false);
        }

        [AllowAnonymous]
        [HttpPost("password/forgot/reset")]
        public async Task<IActionResult> ResetUserPasswordAsync([FromBody] ModelApiServiceRequest<ModelResetUserPassword> apiRequest)
        {
            return await ExecuteServiceAsync<ModelResetUserPassword, ResetUserPassword, User, ModelUser>(
                ApiOperationType.ResetUserPassword,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByIdAsync(request.Data.UserId.ToString()).ConfigureAwait(false);

                    var resetPasswordResult = await _userManager.ResetPasswordAsync(user, request.Data.Token, request.Data.NewPassword).ConfigureAwait(false);
                    if (!resetPasswordResult.Succeeded)
                    {
                        throw new ValidationException(new ValidationError(resetPasswordResult.Errors.FirstOrDefault()?.Description, OperationErrorType.Unknown));
                    }

                    return new ServiceResponse<User>(user);
                },
                useTransaction: true,
            requestUser: true).ConfigureAwait(false);
        }

        [HttpPost("password/change")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ModelApiServiceRequest<ModelChangeUserPassword> apiRequest)
        {
            return await ExecuteServiceAsync<ModelChangeUserPassword, ChangeUserPassword, User, ModelUser>(
                ApiOperationType.ChangeUserPassword,
                apiRequest,
                async request =>
                {
                    var user = await _userManager.FindByIdAsync(request.User.Id.ToString()).ConfigureAwait(false);

                    var changePasswordRes = await _userManager.ChangePasswordAsync(user, request.Data.OldPassword, request.Data.NewPassword).ConfigureAwait(false);
                    if (!changePasswordRes.Succeeded)
                    {
                        throw new ApplicationUserManagerException(changePasswordRes.Errors);
                    }

                    return new ServiceResponse<User>(user);
                },
                useTransaction: true,
                requestUser: true).ConfigureAwait(false);
        }

        private static string GenerateJwtToken(User user, string userRole)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, userRole ?? String.Empty)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Constants.JwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(Constants.JwtExpireDays, CultureInfo.InvariantCulture));

            var token = new JwtSecurityToken(
                Constants.JwtIssuer,
                Constants.JwtIssuer,
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
