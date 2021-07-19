using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceMetric 
    {
        Task<ServiceResponse<Metric>> GetAllMetrics(IServiceRequest request, string languageCode);
        Task<ServiceResponse<MetricDetails>> GetAllMetricDetails(IServiceRequest request, string languageCode);
        Task<ServiceResponse<Metric>> SearchMetrics(IServiceRequest request, string languageCode, string searchKey);
        Task<ServiceResponse<Metric>> GetMetricById(IServiceRequest request, Guid id);
        Task<ServiceResponse<Metric>> CreateMetric(IServiceRequest request, Metric metric);
        Task<ServiceResponse<Metric>> UpdateMetric(IServiceRequest request, Guid id, UpdateMetric metric);
        Task<ServiceResponse<Metric>> DeleteMetric(IServiceRequest request, Guid id);
    }
}