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
    public class ChartController : BaseApiController
    {
        private readonly IServiceChart _serviceChart;

        public ChartController(IServiceChart serviceChart)
        {
            _serviceChart = serviceChart;
        }

        [HttpGet("user/{userId:Guid}")]
        public async Task<IActionResult> GetUserCharts(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, FitFortisChart, ModelChart>(
                ApiOperationType.GetUserCharts,
                apiRequest,
                async request => await _serviceChart.GetAllChartsForUser(request, userId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("user/{userId:Guid}/bulk/lang/{language}")]
        public async Task<IActionResult> GetUserChartDetails(Guid userId, string language, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, ChartDetails, ModelChartDetails>(
                ApiOperationType.GetUserChartDetails,
                apiRequest,
                async request => await _serviceChart.GetChartDetailsForUser(request, userId, language).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}/user/{userId:Guid}")]
        public async Task<IActionResult> GetChartById(Guid id, Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, FitFortisChart, ModelChart>(
                ApiOperationType.GetChartById,
                apiRequest,
                async request => await _serviceChart.GetChartById(request, userId, id).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<IActionResult> CreateChart([FromBody]ModelApiServiceRequest<ModelChart> apiRequest)
        {
            return await ExecuteServiceAsync<ModelChart, FitFortisChart, FitFortisChart, ModelChart>(
                ApiOperationType.CreateChart,
                apiRequest,
                async request => await _serviceChart.CreateChart(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("metric")]
        public async Task<IActionResult> CreateChartWithMetric([FromBody]ModelApiServiceRequest<ModelCreateCharWithMetrric> apiRequest)
        {
            return await ExecuteServiceAsync<ModelCreateCharWithMetrric, CreateCharWithMetrric, ChartDetails, ModelChartDetails>(
                ApiOperationType.CreateChartWithMetric,
                apiRequest,
                async request => await _serviceChart.CreateChartWithMetric(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("metric/bulk")]
        public async Task<IActionResult> CreateChartWithMetrics([FromBody]ModelApiServiceRequest<ModelCreateCharWithMetrric> apiRequest)
        {
            return await ExecuteServiceAsync<ModelCreateCharWithMetrric, CreateCharWithMetrric, ChartDetails, ModelChartDetails>(
                ApiOperationType.CreateChartWithMetric,
                apiRequest,
                async request => await _serviceChart.CreateChartWithMetrics(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateChart(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateChart> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateChart, UpdateChart, FitFortisChart, ModelChart>(
                ApiOperationType.UpdateChart,
                apiRequest,
                async request => await _serviceChart.UpdateChart(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteChart(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, FitFortisChart, ModelChart>(
                ApiOperationType.DeleteChart,
                apiRequest,
                async request => await _serviceChart.RemoveChart(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
