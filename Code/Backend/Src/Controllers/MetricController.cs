using System;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class MetricController : BaseApiController
    {
        private readonly IServiceMetric _serviceMetric;
        private readonly IServiceSearchRequest _serviceSearchRequest;

        public MetricController(IServiceMetric serviceMetric, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceMetric = serviceMetric;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("search/lang/{languageCode}")]
        public async Task<IActionResult> GetAllMetrics(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Metric, ModelMetric>(
                ApiOperationType.GetAllMetrics,
                apiRequest,
                async request => await _serviceMetric.GetAllMetrics(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("search/lang/{languageCode}/key/{searchKey}")]
        public async Task<IActionResult> SearchMetrics(string languageCode, string searchKey, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Metric, ModelMetric>(
                ApiOperationType.SearchMetrics,
                apiRequest,
                async request => await _serviceMetric.SearchMetrics(request, languageCode, searchKey).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("details/lang/{languageCode}")]
        public async Task<IActionResult> GetAllMetricDetails(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, MetricDetails, ModelMetricDetails>(
                ApiOperationType.GetAllMetricDetails,
                apiRequest,
                async request => await _serviceMetric.GetAllMetricDetails(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetMetricById(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Metric, ModelMetric>(
                ApiOperationType.GetMetricById,
                apiRequest,
                async request => await _serviceMetric.GetMetricById(request, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMetric([FromBody]ModelApiServiceRequest<ModelMetric> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetric, Metric, Metric, ModelMetric>(
                ApiOperationType.CreateMetric,
                apiRequest,
                async request => await _serviceMetric.CreateMetric(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateMetric(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateMetric> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateMetric, UpdateMetric, Metric, ModelMetric>(
                ApiOperationType.UpdateMetric,
                apiRequest,
                async request => await _serviceMetric.UpdateMetric(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteMetric(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Metric, ModelMetric>(
                ApiOperationType.DeleteMetric,
                apiRequest,
                async request => await _serviceMetric.DeleteMetric(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetMetricSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetMetricSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetRecentHistory(request, userId, null, SearchArea.Metric).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        public async Task<IActionResult> AddMetricSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddMetricSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.Metric;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteMetricSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteMetricSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/user/{userId}")]
        public async Task<IActionResult> DeleteAllEncyclopediaSearch(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteAllMetricSearchItems,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequestsForArea(request, userId, SearchArea.Metric).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}