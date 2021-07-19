using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceDocument 
    {
        Task<ServiceResponse<Document>> GetDocumentsForUser(IServiceRequest request, Guid userId);
        Task<ServiceResponse<Document>> GetInactiveDocumentsForUser(IServiceRequest request, Guid userId);
        Task<ServiceResponse<Document>> GetDocumentsById(IServiceRequest request, Guid id);
        Task<ServiceResponse<Document>> CreateDocument(IServiceRequest request, Document document);
        Task<ServiceResponse<Document>> UpdateDocument(IServiceRequest request, Guid id, UpdateDocument document);
        Task<ServiceResponse<Document>> RestoreDocumentsFromBin(IServiceRequest request, Guid userId, KeysData<Guid> ids);
        Task<ServiceResponse<Document>> InactivateDocument(IServiceRequest request, Guid id);
        Task<ServiceResponse<Document>> RemoveDocument(IServiceRequest request, Guid id);
    }
}