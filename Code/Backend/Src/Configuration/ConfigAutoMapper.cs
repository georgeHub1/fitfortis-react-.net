using AutoMapper;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Microsoft.Extensions.DependencyInjection;
using Metric = Backend.Entities.Metric;

namespace Backend.Configuration
{
    public class ConfigAutoMapper : Profile
    {
        public ConfigAutoMapper() 
            : this("MainProfile")
        {
        }

        protected ConfigAutoMapper(string profileName)
            : base(profileName)
        {
            AllowNullCollections = true;
            AllowNullDestinationValues = true;

            CreateMap(typeof(ModelApiServiceRequest<>), typeof(ServiceRequest<>))
                .ForMember("User", opt => opt.Ignore())
                .ForMember("Operation", opt => opt.Ignore());
            CreateMap(typeof(ServiceResponse<>), typeof(ModelApiServiceResponse<>)).IgnoreAllPropertiesWithAnInaccessibleSetter();

            CreateMap(typeof(KeysData<>), typeof(KeysDataModel<>));

            CreateMap<User, ModelUser>().ReverseMap();
            CreateMap<UpdateUser, ModelUpdateUser>().ReverseMap();
            CreateMap<UserLoginData, ModelUserLoginData>().ReverseMap();
            CreateMap<UserRegisterData, ModelUserRegisterData>().ReverseMap();
            CreateMap<UserRegisterConfirmData, ModelUserRegisterConfirmData>().ReverseMap();
            CreateMap<UserDetails, ModelUserDetails>().ReverseMap();
            CreateMap<ForgotUserPassword, ModelForgotUserPassword>().ReverseMap();
            CreateMap<ResetUserPassword, ModelResetUserPassword>().ReverseMap();
            CreateMap<ChangeUserPassword, ModelChangeUserPassword>().ReverseMap();
            CreateMap<Metric, ModelMetric>().ReverseMap();
            CreateMap<TokenResult, ModelTokenResult>().ReverseMap();
            CreateMap<UpdateMetric, ModelUpdateMetric>().ReverseMap();
            CreateMap<MetricData, ModelMetricData>().ReverseMap();
            CreateMap<MetricDataQueryParams, ModelMetricDataQueryParams>().ReverseMap();
            CreateMap<UpdateMetricData, ModelUpdateMetricData>().ReverseMap();
            CreateMap<DeleteMetricDataBulk, ModelDeleteMetricDataBulk>().ReverseMap();            
            CreateMap<FitFortisChart, ModelChart>().ReverseMap();
            CreateMap<ChartMetric, ModelChartMetric>().ReverseMap();
            CreateMap<UpdateChart, ModelUpdateChart>().ReverseMap();
            CreateMap<UpdateChartMetric, ModelUpdateChartMetric>().ReverseMap();
            CreateMap<StatusResult, ModelStatusResult>().ReverseMap();
            CreateMap<SearchRequest, ModelSearchRequest>().ReverseMap();
            CreateMap<UpdateEncyclopedia, ModelUpdateEncyclopedia>().ReverseMap();
            CreateMap<Audit, ModelAudit>().ReverseMap();
            CreateMap<ChartMetricDetails, ModelChartMetricDetails>().ReverseMap();
            CreateMap<ChartDetails, ModelChartDetails>().ReverseMap();
            CreateMap<FamilyHistory, ModelFamilyHistory>().ReverseMap();
            CreateMap<UserFamilyHistory, ModelUserFamilyHistory>().ReverseMap();
            CreateMap<SearchTerms, ModelSearchTerms>().ReverseMap();
            CreateMap<ChronicCondition, ModelChronicCondition>().ReverseMap();
            CreateMap<UserCondition, ModelUserCondition>().ReverseMap();
            CreateMap<EncyclopediaEntity, ModelEncyclopediaEntity>().ReverseMap();
            CreateMap<UpdateEncyclopediaEntity, ModelUpdateEncyclopediaEntity>().ReverseMap();
            CreateMap<SymptomDetails, ModelSymptomDetails>().ReverseMap();
            CreateMap<SymptomCheckerQueryParams, ModelSymptomCheckerQueryParams>().ReverseMap();
            CreateMap<EncyclopediaShortInfo, ModelEncyclopediaShortInfo>().ReverseMap();
            CreateMap<MetricDetails, ModelMetricDetails>().ReverseMap();
            CreateMap<Document, ModelDocument>().ReverseMap();
            CreateMap<UpdateDocument, ModelUpdateDocument>().ReverseMap();
            CreateMap<CreateCharWithMetrric, ModelCreateCharWithMetrric>().ReverseMap();
            CreateMap<FileUploadDetails, ModelFileUploadDetails>().ReverseMap();
            CreateMap<UploadFile, ModelUploadFile>().ReverseMap();
            CreateMap<ShortUser, ModelShortUser>().ReverseMap();
            CreateMap<ProfileCommonResult, ModelProfileCommonResult>().ReverseMap();
            CreateMap<EnumValuesResult, ModelEnamValuesResult>().ReverseMap();
            CreateMap<ShortMetricData, ModelShortMetricData>().ReverseMap();
            CreateMap<UpsertMetricData, ModelUpsertMetricData>().ReverseMap();
            CreateMap<UpdateBasicInformation, ModelUpdateBasicInformation>().ReverseMap();
            CreateMap<UpdateLifestyle, ModelUpdateLifestyle>().ReverseMap();
            CreateMap<UserVaccineTherapy, ModelUserVaccineTherapy>().ReverseMap();
            CreateMap<UpdateNews, ModelUpdateNews>().ReverseMap();
            CreateMap<News, ModelNews>().ReverseMap();
            CreateMap<NewsDetails, ModelNewsDetails>().ReverseMap();
            CreateMap<CreateLike, ModelCreateLike>().ReverseMap();
            CreateMap<NewsLikesAndComments, ModelNewsLikesAndComments>().ReverseMap();
            CreateMap<GetNewsQueryParams, ModelGetNewsQueryParams>().ReverseMap();
            CreateMap<ShareEmail, ModelShareEmail>().ReverseMap();
            CreateMap<CreateRole, ModelCreateRole>().ReverseMap();
            CreateMap<AddUserRole, ModelAddUserRole>().ReverseMap();
            CreateMap<UserAlert, ModelUpdateAlert>().ReverseMap();
            CreateMap<Alert, ModelAlert>().ReverseMap();
            CreateMap<UserAlert, ModelUserAlert>().ReverseMap();
            CreateMap<AlertDetails, ModelAlertDetails>().ReverseMap();
            CreateMap<AnalyticUserSignIn, ModelAnalyticUserSignIn>().ReverseMap();
            CreateMap<Analytic, ModelAnalytic>().ReverseMap();
            CreateMap<AnalyticData, ModelAnalyticData>().ReverseMap();
            CreateMap<AnalyticDataDetails, ModelAnalyticDataDetails>().ReverseMap();
            CreateMap<AlertDetails, ModelAnalyticDetails>().ReverseMap();
            CreateMap<ShortAnalytic, ModelShortAnalytic>().ReverseMap();
            CreateMap<HealthIndexDetails, ModelHealthIndexDetails>().ReverseMap();
            CreateMap<AnalyticUserSigninDetails, ModelAnalyticUserSigninDetails>().ReverseMap();
            CreateMap<Drug, ModelDrug>().ReverseMap();
            CreateMap<ShortControlCheckup, ModelShortControlCheckup>().ReverseMap();
        }

        public static void Init(IServiceCollection services)
        {
            var config = new MapperConfiguration(cfg => cfg.AddProfile(new ConfigAutoMapper()));

            var mapper = config.CreateMapper();

            services.AddSingleton(mapper);
        }
    }
}
