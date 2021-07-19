using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceAnalytic
    {
        Task<ServiceResponse<AnalyticData>> SetValueForAnalytic(IServiceRequest request, Guid analyticId);
        Task<ServiceResponse<AnalyticData>> GetDataForAnalytic(IServiceRequest request, Guid analyticId, MetricDataQueryParams queryParam);
        Task<ServiceResponse<ShortAnalytic>> GetAllAnalytic(IServiceRequest request, string language);
        Task<ServiceResponse<AnalyticDetails>> GetAnalyticDetails(IServiceRequest request, string language, MetricDataQueryParams queryParam);
        Task<ServiceResponse<AnalyticDataDetails>> GetAllAnalyticStatistic(IServiceRequest request, string language);
        Task<ServiceResponse<Analytic>> AddAnalytic(IServiceRequest request, Analytic analytic);
        Task<ServiceResponse<Analytic>> UpdateAnalytic(IServiceRequest request, Guid analyticId, Analytic analytic);
        Task<ServiceResponse<Analytic>> RemoveAnalytic(IServiceRequest request, Guid analyticId);
    }
}
