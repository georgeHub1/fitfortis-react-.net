using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceSymptomChecker
    {
        Task<ServiceResponse<SymptomDetails>> GetSymptomDetails(IServiceRequest request, string languageCode, SymptomCheckerQueryParams parameters);
    }
}