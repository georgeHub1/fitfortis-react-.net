using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public interface IServiceEmail 
    {
        Task SendEmailAsync(IServiceRequest request, EmailType emailType, User fromUser,
            User toUser, string subject, string templateId, BaseEmailData emailParams);
    }
}