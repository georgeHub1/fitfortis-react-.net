using System;
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
    public class SymptomCheckerController : BaseApiController
    {
        private readonly IServiceSymptomChecker _serviceSymptomChecker;
        private readonly IServiceSearchRequest _serviceSearchRequest;

        public SymptomCheckerController(IServiceSymptomChecker serviceSymptomChecker, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceSymptomChecker = serviceSymptomChecker;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("search/lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllSymptoms(string languageCode, ModelApiServiceRequest<ModelSymptomCheckerQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSymptomCheckerQueryParams, SymptomCheckerQueryParams, SymptomDetails, ModelSymptomDetails>(
                ApiOperationType.GetAllSymptomDetails,
                apiRequest,
                async request => await _serviceSymptomChecker.GetSymptomDetails(request, languageCode, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetSymptomSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetSymptomSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetRecentHistory(request, userId, null, SearchArea.SymptomChecker).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        [AllowAnonymous]
        public async Task<IActionResult> AddSymptomSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddSymptomSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.SymptomChecker;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteSymptomSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteSymptomSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
