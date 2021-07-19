using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceChart
    {
        Task<ServiceResponse<FitFortisChart>> GetAllChartsForUser(IServiceRequest request, Guid userId);
        Task<ServiceResponse<ChartDetails>> GetChartDetailsForUser(IServiceRequest request, Guid userId, string language);
        Task<ServiceResponse<FitFortisChart>> GetChartById(IServiceRequest request, Guid userId, Guid id);
        Task<ServiceResponse<FitFortisChart>> CreateChart(IServiceRequest request, FitFortisChart chart);
        Task<ServiceResponse<ChartDetails>> CreateChartWithMetric(IServiceRequest request, CreateCharWithMetrric chart);
        Task<ServiceResponse<ChartDetails>> CreateChartWithMetrics(IServiceRequest request, CreateCharWithMetrric chart);
        Task<ServiceResponse<FitFortisChart>> UpdateChart(IServiceRequest request, Guid id, UpdateChart chart);
        Task<ServiceResponse<FitFortisChart>> RemoveChart(IServiceRequest request, Guid id);

    }
}
