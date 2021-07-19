using System;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class DocumentController : BaseApiController
    {
        private readonly IServiceDocument _serviceDocument;
        private readonly IBlobService _blobService;
        private readonly IServiceSearchRequest _serviceSearchRequest;


        public DocumentController(IServiceDocument serviceDocument, IBlobService blobService, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceDocument = serviceDocument;
            _blobService = blobService;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("user/{userId:Guid}")]
        public async Task<IActionResult> GetUserDocuments(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Document, ModelDocument>(
                ApiOperationType.GetUserDocuments,
                apiRequest,
                async request => await _serviceDocument.GetDocumentsForUser(request, userId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("user/{userId:Guid}/recyclebin")]
        public async Task<IActionResult> GetInactiveUserDocuments(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Document, ModelDocument>(
                ApiOperationType.GetUserDocuments,
                apiRequest,
                async request => await _serviceDocument.GetInactiveDocumentsForUser(request, userId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetDocumentById(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Document, ModelDocument>(
                ApiOperationType.GetDocumentById,
                apiRequest,
                async request => await _serviceDocument.GetDocumentsById(request, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}/download")]
        public async Task<FileContentResult> DownloadDocument(Guid id)
        {
            var request = await _blobService.DownloadFileAsync(AttachmentType.Document, id).ConfigureAwait(false);

            var result = request.Item;

            var contentType = new MediaTypeHeaderValue(result.ContentType).ToString();
            var fileBytes = result.Stream.GetBuffer();

            return new FileContentResult(fileBytes, contentType)
            {
                FileDownloadName = result.FileName
            };
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetDocumentSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetNewsSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetRecentHistory(request, userId, null, SearchArea.Document).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        public async Task<IActionResult> AddDocumentSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddNewsSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.Document;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpPost("user/{userId:Guid}/upload")]
        public async Task<IActionResult> UploadUserDocument(Guid userId, [FromForm] ModelUploadFile fileRequest)
        {
            var apiRequest = new ModelApiServiceRequest<ModelUploadFile>{Data = fileRequest };
            return await ExecuteServiceAsync<ModelUploadFile, UploadFile, Document, ModelDocument>(
                ApiOperationType.UploadDocument,
                apiRequest,
                async request =>
                {
                    var result = await _blobService.UploadFileAsync(AttachmentType.Document, request.Data.File, userId).ConfigureAwait(false);
                    return await _serviceDocument.CreateDocument(request, new Document
                    {
                        Id = result.Item.Id,
                        ContentType = result.Item.ContentType,
                        Date = fileRequest.Date,
                        FieldId = result.Item.Id,
                        FileName = result.Item.FileName,
                        OriginalFileName = result.Item.FileName,
                        FileUri = result.Item.FileUrl,
                        UserId = result.Item.UserId,
                        Type = fileRequest.Type,
                        Description = fileRequest.Description,
                        FileSize = fileRequest.FileSize
                        
                    }).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateDocument(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateDocument> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateDocument, UpdateDocument, Document, ModelDocument>(
                ApiOperationType.UpdateDocument,
                apiRequest,
                async request => await _serviceDocument.UpdateDocument(request, id, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPut("user/{userId:Guid}/restore")]
        public async Task<IActionResult> RestoreDocuments(Guid userId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, Document, ModelDocument>(
                ApiOperationType.UpdateDocument,
                apiRequest,
                async request => await _serviceDocument.RestoreDocumentsFromBin(request, userId, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}/inactivate")]
        public async Task<IActionResult> InactivateDocument(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Document, ModelDocument>(
                ApiOperationType.InactivateDocument,
                apiRequest,
                async request => await _serviceDocument.InactivateDocument(request, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> RemoveDocument(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Document, ModelDocument>(
                ApiOperationType.RemoveDocument,
                apiRequest,
                async request =>
                {
                    await _blobService.RemoveFileAsync(AttachmentType.Document, id).ConfigureAwait(false);
                    return await _serviceDocument.RemoveDocument(request, id).ConfigureAwait(false);
                },
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteDocumentSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteNewsSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
