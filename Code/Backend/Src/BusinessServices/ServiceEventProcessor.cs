using System;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public class ServiceEventProcessor : BaseService, IServiceEventProcessor
    {
        private readonly IServiceEmail _emailService;
        private readonly IRepositoryUser _userRepository;

        public ServiceEventProcessor(IServiceEmail emailService, IRepositoryUser userRepository)
        {
            _emailService = emailService;
            _userRepository = userRepository;
        }

        public async Task OnRegistrationConfirmation(IServiceRequest request, User fromUser, Guid toUserId, string emailConfirmationToken)
        {
            var toUser = _userRepository.SelectById(toUserId);
            if (toUser != null)
            {
                var emailParams = new OnRegistrationConfirmationEmailData
                {
                    UsernameTo = toUser.DisplayName,
                    UrlConfirm = new Uri(ConfigApp.Settings.WebAppBaseUrl, $"confirm?token={emailConfirmationToken}&userId={toUserId}").ToString()
                };

                await _emailService.SendEmailAsync(request, EmailType.OnRegistrationConfirmation, null, toUser,
                    Constants.UserConfirmationSubject,
                    Constants.OnRegistrationConfirmationTemplateId, emailParams).ConfigureAwait(false);
            }
        }

        public async Task OnForgotUserPasswordAsync(IServiceRequest request, User fromUser, Guid toUserId, string resetPasswordToken)
        {
            var toUser = _userRepository.SelectById(toUserId);

            if (toUser != null)
            {
                var emailParams = new OnForgotUserPasswordEmailData
                {
                    UsernameTo = toUser.DisplayName,
                    Email = toUser.Email,
                    ResetPasswordUrl = new Uri(ConfigApp.Settings.WebAppBaseUrl, $"newPassword/{resetPasswordToken}/{toUserId}").ToString()
                };

                await _emailService.SendEmailAsync(request, EmailType.OnForgotUserPassword, null, toUser,
                    Constants.ForgotUserPasswordSubject, Constants.OnPasswordForgotTemplateId, emailParams).ConfigureAwait(false);
            }
        }

        public async Task OnNewsShareAsync(IServiceRequest request, User fromUser, User toUser, string emailBody)
        {
            if (toUser != null)
            {
                var emailParams = new CustomEmailData
                {
                    Body = emailBody,
                    Subject = Constants.NewsShareSubject
                };

                await _emailService.SendEmailAsync(request, EmailType.CustomEmail, fromUser, toUser,
                    Constants.NewsShareSubject, Constants.CustomEmailTemplateId, emailParams).ConfigureAwait(false);
            }
        }
    }
}
