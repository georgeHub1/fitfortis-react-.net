using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceDocument : BaseService, IServiceDocument
    {
        private readonly IRepositoryDocument _repositoryDocument;

        public ServiceDocument(IRepositoryDocument repositoryDocument)
        {
            _repositoryDocument = repositoryDocument;
        }

        public async Task<ServiceResponse<Document>> GetDocumentsForUser(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDocument.GetUserDocuments(userId);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Document>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> GetInactiveDocumentsForUser(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDocument.GetInactiveDocuments(userId);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Document>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> GetDocumentsById(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDocument.SelectById(id);

                return new ServiceResponse<Document>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> CreateDocument(IServiceRequest request, Document document)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDocument.Create(document);

                _repositoryDocument.Save();

                return new ServiceResponse<Document>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> UpdateDocument(IServiceRequest request, Guid id, UpdateDocument document)
        {
            return await ExecuteAsync(() =>
            {
                var localDocument = _repositoryDocument.SelectById(id);

                localDocument.FileName = document.FileName;
                localDocument.Description = document.Description;
                localDocument.Type = document.Type;
                localDocument.Date = document.Date ?? localDocument.Date;

                _repositoryDocument.Update(localDocument);
                _repositoryDocument.Save();

                return new ServiceResponse<Document>(localDocument);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> RestoreDocumentsFromBin(IServiceRequest request, Guid userId, KeysData<Guid> ids)
        {
            return await ExecuteAsync(() =>
            {
                var listIds = ids.Keys;

                var data = _repositoryDocument.GetInactiveDocuments(userId).Where(it => listIds.Contains(it.Id)).ToList();

                foreach (var document in data.ToList())
                {
                    document.InactiveAt = null;

                    _repositoryDocument.Update(document);
                }

                _repositoryDocument.Save();

                return new ServiceResponse<Document>(data, data.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> InactivateDocument(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var localDocument = _repositoryDocument.SelectById(id);

                localDocument.InactiveAt = DateTime.UtcNow;

                _repositoryDocument.Update(localDocument);
                _repositoryDocument.Save();

                return new ServiceResponse<Document>(localDocument);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Document>> RemoveDocument(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryDocument.Delete(id);

                _repositoryDocument.Save();

                return new ServiceResponse<Document>(data);
            }).ConfigureAwait(false);
        }
    }
}