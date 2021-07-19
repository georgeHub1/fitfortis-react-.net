using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.Exceptions;
using Backend.ModelService;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace Backend.BusinessServices
{
    public class ServiceSendGrid : BaseService, ISendGridService
    {
        private ISendGridClient _sendGridClient;

        private ISendGridClient SendGridClient => _sendGridClient ?? (_sendGridClient = new SendGridClient(ConfigApp.Settings.SendgridApiKey));

        public async Task<HttpStatusCode> SendMailAsync(string fromAddress, string toAddress, string subject, string plainTextContent, string htmltContent)
        {
            var msg = new SendGridMessage
            {
                From = new EmailAddress(fromAddress),
                Subject = subject,
                PlainTextContent = plainTextContent,
                HtmlContent = htmltContent,
            };

            msg.AddTo(new EmailAddress(toAddress));

            var response = await SendGridClient.SendEmailAsync(msg).ConfigureAwait(false);

            return response.StatusCode;
        }

        public async Task<HttpStatusCode> SendMailAsync(string fromAddress, string toAddress, string subject, string templateId, EmailTemplateParams emailTemplateParams)
        {
            var msg = new SendGridMessage
            {
                From = new EmailAddress(fromAddress),
                TemplateId = templateId,
                Subject = subject,
                PlainTextContent = subject,
                HtmlContent = subject,
                //SendAt = sendAt
            };

            msg.AddTo(new EmailAddress(toAddress));

            if (emailTemplateParams?.PropertiesDictionary != null)
            {
                msg.Personalizations[0].Substitutions = new Dictionary<string, string>();

                foreach (var dictionaryEntry in emailTemplateParams.PropertiesDictionary)
                {
                    msg.Personalizations[0].Substitutions.Add(dictionaryEntry.Key, dictionaryEntry.Value);
                }
            }

            var response = await SendGridClient.SendEmailAsync(msg).ConfigureAwait(false);
            if (response.StatusCode != HttpStatusCode.Accepted)
            {
                var errorsData = await response.DeserializeResponseBodyAsync(response.Body).ConfigureAwait(false);
                throw new SendGridException(errorsData);
            }

            return response.StatusCode;
        }
    }
}
