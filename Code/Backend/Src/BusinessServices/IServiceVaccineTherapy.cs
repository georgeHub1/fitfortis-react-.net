using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceVaccineTherapy
    {
        Task<ServiceResponse<ProfileCommonResult>> GetUserVaccineAndTherapies(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<UserVaccineTherapy>> AddUserVaccineAndTherapies(IServiceRequest request, Guid userId, KeysData<Guid> vaccineIds);

        Task<ServiceResponse<UserVaccineTherapy>> RemoveUserVaccineAndTherapies(IServiceRequest request, Guid userId, KeysData<Guid> vaccineIds);
    }
}
