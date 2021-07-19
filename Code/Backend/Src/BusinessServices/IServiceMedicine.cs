using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceMedicine
    {
        Task<ServiceResponse<Drug>> GetMedicineById(IServiceRequest request, Guid id, string languageCode);
        Task<ServiceResponse<SearchTerms>> GetMedicineSearchTerms(IServiceRequest request, string languageCode);
        Task<ServiceResponse<Drug>> AddMedicineItem(IServiceRequest request, Drug encyclopedia);
        Task<ServiceResponse<Drug>> UpdateMedicineItem(IServiceRequest request, Guid id, UpdateEncyclopediaEntity encyclopedia);
        Task<ServiceResponse<Drug>> DeleteMedicineItem(IServiceRequest request, Guid id);
    }
}
