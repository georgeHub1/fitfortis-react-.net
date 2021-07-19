using Backend.BusinessServices;
using Backend.DatabaseAccess;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Configuration
{
    public static class ConfigDependencyInjection
    {
        public static void Init(IServiceCollection services)
        {
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            // Services
            services.AddTransient<IServiceEventProcessor, ServiceEventProcessor>();
            services.AddTransient<ISendGridService, ServiceSendGrid>();
            services.AddTransient<IServiceEmail, ServiceEmail>();
            services.AddTransient<IServiceUser, ServiceUser>();
            services.AddTransient<IServiceMetric, ServiceMetric>();
            services.AddTransient<IServiceMetricData, ServiceMetricData>();
            services.AddTransient<IServiceChart, ServiceChart>();
            services.AddTransient<IServiceChartMetric, ServiceChartMetric>();
            services.AddTransient<IServiceEncyclopedia, ServiceEncyclopedia>();
            services.AddTransient<IServiceSearchRequest, ServiceSearchRequest>();
            services.AddTransient<IServiceAudit, ServiceAudit>();
            services.AddTransient<IServiceLogging, ServiceLogging>();
            services.AddTransient<IServiceFamilyHistory, ServiceFamilyHistory>();
            services.AddTransient<IServiceChronicCondition, ServiceChronicCondition>();
            services.AddTransient<IServiceSymptomChecker, ServiceSymptomChecker>();
            services.AddTransient<IServiceDocument, ServiceDocument>();
            services.AddTransient<IBlobService, BlobService>();
            services.AddTransient<IServiceVaccineTherapy, ServiceVaccineTherapy>();
            services.AddTransient<IServiceNews, ServiceNews>();
            services.AddTransient<IServiceAlert, ServiceAlert>();
            services.AddTransient<IServiceAnalytic, ServiceAnalytic>();
            services.AddTransient<IServiceMedicine, ServiceMedicine>();
            
            // Repositories
            services.AddTransient<IRepositoryUser, RepositoryUser>();
            services.AddTransient<IRepositoryMetric, RepositoryMetric>();
            services.AddTransient<IRepositoryMetricData, RepositoryMetricData>();
            services.AddTransient<IRepositoryChart, RepositoryChart>();
            services.AddTransient<IRepositoryChartMetric, RepositoryChartMetric>();
            services.AddTransient<IRepositorySearchRequest, RepositorySearchRequest>();
            services.AddTransient<IRepositoryAudit, RepositoryAudit>();
            services.AddTransient<IRepositoryExceptionLog, RepositoryExceptionLog>();
            services.AddTransient<IRepositoryFamilyHistory, RepositoryFamilyHistory>();
            services.AddTransient<IRepositoryUserFamilyHistory, RepositoryUserFamilyHistory>();
            services.AddTransient<IRepositoryChronicCondition, RepositoryChronicCondition>();
            services.AddTransient<IRepositoryUserCondition, RepositoryUserCondition>();
            services.AddTransient<IRepositoryEncyclopediaEntity, RepositoryEncyclopediaEntity>();
            services.AddTransient<IRepositorySymptomChecker, RepositorySymptomChecker>();
            services.AddTransient<IRepositoryDocument, RepositoryDocument>();
            services.AddTransient<IRepositoryVaccineTherapy, RepositoryVaccineTherapy>();
            services.AddTransient<IRepositoryUserVaccineTherapy, RepositoryUserVaccineTherapy>();
            services.AddTransient<IRepositoryNews, RepositoryNews>();
            services.AddTransient<IRepositoryNewsLikes, RepositoryNewsLikes>();
            services.AddTransient<IRepositoryAlert, RepositoryAlert>();
            services.AddTransient<IRepositoryUserAlert, RepositoryUserAlert>();
            services.AddTransient<IRepositoryUserLoginStats, RepositoryUserLoginStats>();
            services.AddTransient<IRepositoryAnalytic, RepositoryAnalytic>();
            services.AddTransient<IRepositoryAnalyticData, RepositoryAnalyticData>();
            services.AddTransient<IRepositoryDrug, RepositoryDrug>();
            services.AddTransient<IRepositoryControlCheckup, RepositoryControlCheckup>();
        }
    }
}
