using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class EncyclopediaController : BaseApiController
    {
        private readonly IServiceEncyclopedia _serviceEncyclopedia;
        private readonly IServiceSearchRequest _serviceSearchRequest;

        public EncyclopediaController(IServiceEncyclopedia serviceEncyclopedia, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceEncyclopedia = serviceEncyclopedia;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("import")]
        [AllowAnonymous]
        public async Task<IActionResult> Import(ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, StatusResult, ModelStatusResult>(
                ApiOperationType.Import,
                apiRequest,
                async request => await _serviceEncyclopedia.ImportEncyclopedia(request, "C:\\Users\\andriy\\Desktop\\FDA.xlsx").ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpGet("search/lang/{languageCode}/key/{searchKey}")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchEncyclopedia(string languageCode, string searchKey, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchTerms, ModelSearchTerms>(
                ApiOperationType.SearchEncyclopedia,
                apiRequest,
                async request => await _serviceEncyclopedia.GetEncyclopediaSearchTerms(request, languageCode, searchKey).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }


        [HttpGet("search/lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEncyclopedia(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchTerms, ModelSearchTerms>(
                ApiOperationType.GetAllEncyclopedia,
                apiRequest,
                async request => await _serviceEncyclopedia.GetEncyclopediaSearchTerms(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}/lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetEncyclopediaById(Guid id, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, EncyclopediaEntity, ModelEncyclopediaEntity>(
                ApiOperationType.GetEncyclopediaById,
                apiRequest,
                async request => await _serviceEncyclopedia.GetEncyclopediaById(request, id, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<IActionResult> CreateEncyclopediaEntry([FromBody]ModelApiServiceRequest<ModelEncyclopediaEntity> apiRequest)
        {
            return await ExecuteServiceAsync<ModelEncyclopediaEntity, EncyclopediaEntity, EncyclopediaEntity, ModelEncyclopediaEntity>(
                ApiOperationType.CreateEncyclopedia,
                apiRequest,
                async request => await _serviceEncyclopedia.AddEncyclopediaItem(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateEncyclopediaEntry(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateEncyclopediaEntity> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateEncyclopediaEntity, UpdateEncyclopediaEntity, EncyclopediaEntity, ModelEncyclopediaEntity>(
                ApiOperationType.UpdateEncyclopedia,
                apiRequest,
                async request => await _serviceEncyclopedia.UpdateEncyclopediaItem(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteEncyclopediaEntry(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, EncyclopediaEntity, ModelEncyclopediaEntity>(
                ApiOperationType.DeleteEncyclopedia,
                apiRequest,
                async request => await _serviceEncyclopedia.DeleteEncyclopediaItem(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetEncyclopediaSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetEncyclopediaSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetEncyclopediaSearchHistory(request, userId).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        [AllowAnonymous]
        public async Task<IActionResult> AddEncyclopediaSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddEncyclopediaSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.Encyclopedia;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteEncyclopediaSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteEncyclopediaSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/user/{userId}")]
        public async Task<IActionResult> DeleteAllEncyclopediaSearch(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteAllEncyclopediaSearchItems,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequestsForArea(request, userId, SearchArea.Encyclopedia).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
