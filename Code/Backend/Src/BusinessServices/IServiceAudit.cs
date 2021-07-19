using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceAudit 
    {
        Task<ServiceResponse<Audit>> GetUserActivity(IServiceRequest request, Guid userId);
    }
}