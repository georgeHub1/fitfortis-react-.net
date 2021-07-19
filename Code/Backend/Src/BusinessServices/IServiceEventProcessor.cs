using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceEventProcessor 
    {
        Task OnRegistrationConfirmation(IServiceRequest request, User fromUser, Guid toUserId, string emailConfirmationToken);
        Task OnForgotUserPasswordAsync(IServiceRequest request, User fromUser, Guid toUserId, string resetPasswordToken);
        Task OnNewsShareAsync(IServiceRequest request, User fromUser, User toUser, string emailBody);
    }
}
