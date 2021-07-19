using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceAudit : BaseService, IServiceAudit
    {
        private readonly IRepositoryAudit _repositoryAudit;

        public ServiceAudit(IRepositoryAudit repositoryAudit)
        {
            _repositoryAudit = repositoryAudit;
        }

        public async Task<ServiceResponse<Audit>> GetUserActivity(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryAudit.GetUsersActivity(userId);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Audit>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }
    }
}