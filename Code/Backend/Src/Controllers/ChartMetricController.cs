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
    public class ChartMetricController : BaseApiController
    {
        private readonly IServiceChartMetric _serviceChartMetric;

        public ChartMetricController(IServiceChartMetric serviceChartMetric)
        {
            _serviceChartMetric = serviceChartMetric;
        }

        [HttpGet("chart/{id:Guid}")]
        public async Task<IActionResult> GetMetricForChart(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ChartMetric, ModelChartMetric>(
                ApiOperationType.GetMetricsForChart,
                apiRequest,
                async request => await _serviceChartMetric.GetMetricsForChart(request, id).ConfigureAwait(false),
                useTransaction: false, requestUser:true).ConfigureAwait(false);
        }

        [HttpPost("chart/{chartId:Guid}/metric/{metricId:Guid}")]
        public async Task<IActionResult> CreateChart(Guid chartId, Guid metricId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ChartMetric, ModelChartMetric>(
                ApiOperationType.CreateChartWithMetric,
                apiRequest,
                async request => await _serviceChartMetric.AddDefaultMetricToChart(request, chartId, metricId).ConfigureAwait(false), requestUser:true).ConfigureAwait(false);
        }

        [HttpPost("chart/{chartId:Guid}/metric")]
        public async Task<IActionResult> CreateChart(Guid chartId, [FromBody]ModelApiServiceRequest<KeysDataModel<Guid>> apiRequest)
        {
            return await ExecuteServiceAsync<KeysDataModel<Guid>, KeysData<Guid>, ChartMetric, ModelChartMetric>(
                ApiOperationType.CreateChartWithDefaultMetrics,
                apiRequest,
                async request => await _serviceChartMetric.AddDefaultMetricsToChart(request, chartId, request.Data).ConfigureAwait(false), requestUser: true).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateChart(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateChartMetric> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateChartMetric, UpdateChartMetric, ChartMetric, ModelChartMetric>(
                ApiOperationType.UpdateChartMetic,
                apiRequest,
                async request => await _serviceChartMetric.UpdateChartMetric(request, request.Data, id).ConfigureAwait(false), requestUser:true).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteMetricFromChart(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ChartMetric, ModelChartMetric>(
                ApiOperationType.DeleteChartMetric,
                apiRequest,
                async request => await _serviceChartMetric.RemoveMetricFromChart(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
