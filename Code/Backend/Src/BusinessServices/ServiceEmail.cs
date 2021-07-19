using System.Threading.Tasks;
using Backend.Configuration;
using Backend.Entities;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public class ServiceEmail : BaseService, IServiceEmail
    {
        private readonly ISendGridService _sendGridService;

        public ServiceEmail(ISendGridService sendGridService)
        {
            _sendGridService = sendGridService;
        }

        public async Task SendEmailAsync(IServiceRequest request, EmailType emailType, User fromUser, User toUser, string subject,
            string templateId, BaseEmailData emailParams)
        {
            if (toUser != null)
            {
                var fromAddress = GetEmailFromAddress(fromUser, toUser);

                await _sendGridService.SendMailAsync(fromAddress, toUser.Email, subject, templateId, new EmailTemplateParams(emailParams)).ConfigureAwait(false);
            }
        }

        private static string GetEmailFromAddress(User fromUser, User toUser)
        {
            var fromAddress = Constants.EmailFromSupport;

            if (!string.IsNullOrEmpty(fromUser?.Email) && fromUser.Email != toUser?.Email)
            {
                fromAddress = fromUser.Email;
            }

            return fromAddress;
        }
    }
}
