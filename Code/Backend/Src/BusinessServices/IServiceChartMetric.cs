using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceChartMetric
    {
        Task<ServiceResponse<ChartMetric>> GetMetricsForChart(IServiceRequest request, Guid chartId);
        Task<ServiceResponse<ChartMetric>> AddDefaultMetricToChart(IServiceRequest request, Guid chartId, Guid metricId);
        Task<ServiceResponse<ChartMetric>> AddDefaultMetricsToChart(IServiceRequest request, Guid chartId, KeysData<Guid> metricIds);
        Task<ServiceResponse<ChartMetric>> UpdateChartMetric(IServiceRequest request, UpdateChartMetric chartMetric, Guid id);
        Task<ServiceResponse<ChartMetric>> RemoveMetricFromChart(IServiceRequest request, Guid id);

    }
}
