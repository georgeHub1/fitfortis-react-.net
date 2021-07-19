using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceMetricData 
    {
        Task<ServiceResponse<MetricData>> GetMetricData(IServiceRequest request, Guid userId, Guid metricId, MetricDataQueryParams param);
        Task<ServiceResponse<MetricData>> CreateMetricData(IServiceRequest request, MetricData metricData);
        Task<ServiceResponse<MetricData>> UpdateMetricData(IServiceRequest request, Guid id, UpdateMetricData metricData);
        Task<ServiceResponse<MetricData>> UpsertMetricData(IServiceRequest request, Guid userId, UpsertMetricData metricData);
        Task<ServiceResponse<MetricData>> DeleteMetricData(IServiceRequest request, Guid id);
        Task<ServiceResponse<MetricData>> DeleteMetricDataBulk(IServiceRequest request, List<Guid> metricDataIds);
    }
}
