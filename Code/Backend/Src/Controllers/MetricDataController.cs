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
    public class MetricDataController : BaseApiController
    {
        private readonly IServiceMetricData _serviceMetricData;

        public MetricDataController(IServiceMetricData serviceMetricData)
        {
            _serviceMetricData = serviceMetricData;
        }

        [HttpGet("user/{userId:Guid}/metric/{metricId:Guid}")]
        public async Task<IActionResult> GetMetricData(Guid userId, Guid metricId, ModelApiServiceRequest<ModelMetricDataQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetricDataQueryParams, MetricDataQueryParams, MetricData, ModelMetricData>(
                ApiOperationType.GetMetricData,
                apiRequest,
                async request => await _serviceMetricData.GetMetricData(request, userId, metricId, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMetricData([FromBody]ModelApiServiceRequest<ModelMetricData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetricData, MetricData, MetricData, ModelMetricData>(
                ApiOperationType.CreateMetricData,
                apiRequest,
                async request => await _serviceMetricData.CreateMetricData(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateMetricData(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateMetricData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateMetricData, UpdateMetricData, MetricData, ModelMetricData>(
                ApiOperationType.UpdateMetricData,
                apiRequest,
                async request => await _serviceMetricData.UpdateMetricData(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("user/{userId}")]
        public async Task<IActionResult> UpsertMetricData(Guid userId, [FromBody]ModelApiServiceRequest<ModelUpsertMetricData> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpsertMetricData, UpsertMetricData, MetricData, ModelMetricData>(
                ApiOperationType.UpsertMetricData,
                apiRequest,
                async request => await _serviceMetricData.UpsertMetricData(request, userId, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteMetricData(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, MetricData, ModelMetricData>(
                ApiOperationType.DeleteMetricData,
                apiRequest,
                async request => await _serviceMetricData.DeleteMetricData(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("bulk")]
        public async Task<IActionResult> DeleteMetricDataBulk([FromBody]ModelApiServiceRequest<ModelDeleteMetricDataBulk> apiRequest)
        {
            return await ExecuteServiceAsync<ModelDeleteMetricDataBulk, DeleteMetricDataBulk, MetricData, ModelMetricData>(
                ApiOperationType.DeleteMetricData,
                apiRequest,
                async request => await _serviceMetricData.DeleteMetricDataBulk(request, request.Data.MetricDataIds).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
