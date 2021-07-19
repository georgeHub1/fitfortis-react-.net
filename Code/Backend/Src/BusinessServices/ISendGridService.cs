using System.Net;
using System.Threading.Tasks;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface ISendGridService 
    {
        Task<HttpStatusCode> SendMailAsync(string fromAddress, string toAddress, string subject, string plainTextContent, string htmltContent);
        Task<HttpStatusCode> SendMailAsync(string fromAddress, string toAddress, string subject, string templateId, EmailTemplateParams emailTemplateParams);
    }
}