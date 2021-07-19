using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceAnalytic : BaseService, IServiceAnalytic
    {
        private readonly IRepositoryAnalytic _repositoryAnalytic;
        private readonly IRepositoryAnalyticData _repositoryAnalyticData;

        public ServiceAnalytic(IRepositoryAnalytic repositoryAnalytic, IRepositoryAnalyticData repositoryAnalyticData)
        {
            _repositoryAnalytic = repositoryAnalytic;
            _repositoryAnalyticData = repositoryAnalyticData;
        }

        public async Task<ServiceResponse<AnalyticData>> SetValueForAnalytic(IServiceRequest request, Guid analyticId)
        {
            return await ExecuteAsync(() =>
            {
                var analyticResult = _repositoryAnalytic.RunAnalytic(analyticId);

                var data = _repositoryAnalyticData.Create(new AnalyticData
                {
                    AnalyticId = analyticId,
                    Value = analyticResult.Value.ToString(CultureInfo.InvariantCulture),
                    Date = DateTime.UtcNow
                });

                _repositoryAnalyticData.Save();

                return new ServiceResponse<AnalyticData>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticData>> GetDataForAnalytic(IServiceRequest request, Guid analyticId, MetricDataQueryParams queryParam)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryAnalyticData.SelectAll().Where(it => it.AnalyticId == analyticId);

                if (queryParam.DateFrom.HasValue)
                {
                    data = data.Where(it => it.Date >= queryParam.DateFrom);
                }

                if (queryParam.DateTo.HasValue)
                {
                    data = data.Where(it => it.Date <= queryParam.DateTo);
                }

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<AnalyticData>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ShortAnalytic>> GetAllAnalytic(IServiceRequest request, string language)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryAnalytic.SelectAll().Select(it => MapAnalytic(it, language));

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<ShortAnalytic>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticDetails>> GetAnalyticDetails(IServiceRequest request, string language, MetricDataQueryParams queryParam)
        {
            return await ExecuteAsync(() =>
            {
                var analyticData = _repositoryAnalyticData.SelectAll();
                if (queryParam.DateFrom.HasValue)
                {
                    analyticData = analyticData.Where(it => it.Date >= queryParam.DateFrom);
                }

                if (queryParam.DateTo.HasValue)
                {
                    analyticData = analyticData.Where(it => it.Date <= queryParam.DateTo);
                }

                var dataDic = analyticData.GroupBy(it => it.AnalyticId).ToDictionary(it => it.Key, it => it.ToList());


                var data = _repositoryAnalytic.SelectAll().Select(it => new AnalyticDetails
                {
                    Analytic = MapAnalytic(it, language),
                    AnalyticData = dataDic.ContainsKey(it.Id) ? dataDic[it.Id] : new List<AnalyticData>()
                });

                return new ServiceResponse<AnalyticDetails>(data.ToList(), data.Count());
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<AnalyticDataDetails>> GetAllAnalyticStatistic(IServiceRequest request, string language)
        {
            return await ExecuteAsync(() =>
            {
                var analytics = _repositoryAnalytic.SelectAll();
                var statistic = new List<AnalyticDataDetails>();

                foreach (var analytic in analytics.ToList())
                {
                    var sqlResult = _repositoryAnalytic.RunAnalytic(analytic.Id);

                    var data = _repositoryAnalyticData.Create(new AnalyticData
                    {
                        AnalyticId = analytic.Id,
                        Value = sqlResult.Value.ToString(CultureInfo.InvariantCulture),
                        Date = DateTime.UtcNow
                    });

                    statistic.Add(new AnalyticDataDetails
                    {
                        Category = analytic.GetCategory(language),
                        Name = analytic.GetName(language),
                        AnalyticData = data
                    });
                }

                _repositoryAnalyticData.Save();

                return new ServiceResponse<AnalyticDataDetails>(statistic, statistic.Count);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Analytic>> AddAnalytic(IServiceRequest request, Analytic analytic)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryAnalytic.Create(analytic);

                _repositoryAnalytic.Save();

                return new ServiceResponse<Analytic>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Analytic>> UpdateAnalytic(IServiceRequest request, Guid analyticId, Analytic analytic)
        {
            return await ExecuteAsync(() =>
            {
                var localAnalytic = _repositoryAnalytic.SelectById(analyticId);

                localAnalytic.SqlQuery = analytic.SqlQuery;

                _repositoryAnalytic.Update(localAnalytic);
                _repositoryAnalytic.Save();

                return new ServiceResponse<Analytic>(localAnalytic);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Analytic>> RemoveAnalytic(IServiceRequest request, Guid analyticId)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryAnalytic.Delete(analyticId);

                _repositoryAnalytic.Save();

                return new ServiceResponse<Analytic>(entity);
            }).ConfigureAwait(false);

        }

        private ShortAnalytic MapAnalytic(Analytic analytic, string language)
        {
            return new ShortAnalytic
            {
                Id = analytic.Id,
                Category = analytic.GetCategory(language),
                Name = analytic.GetName(language),
                SqlQuery = analytic.SqlQuery
            };
        }
    }
}
