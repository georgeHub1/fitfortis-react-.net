using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceEncyclopedia 
    {
        Task<ServiceResponse<StatusResult>> ImportEncyclopedia(IServiceRequest request, string path);

        Task<ServiceResponse<EncyclopediaEntity>> GetEncyclopediaById(IServiceRequest request, Guid id, string languageCode);
        Task<ServiceResponse<SearchTerms>> GetEncyclopediaSearchTerms(IServiceRequest request, string languageCode);
        Task<ServiceResponse<SearchTerms>> GetEncyclopediaSearchTerms(IServiceRequest request, string languageCode, string searchKey);
        Task<ServiceResponse<EncyclopediaEntity>> AddEncyclopediaItem(IServiceRequest request, EncyclopediaEntity encyclopedia);
        Task<ServiceResponse<EncyclopediaEntity>> UpdateEncyclopediaItem(IServiceRequest request, Guid id, UpdateEncyclopediaEntity encyclopedia);
        Task<ServiceResponse<EncyclopediaEntity>> DeleteEncyclopediaItem(IServiceRequest request, Guid id);
    }
}
