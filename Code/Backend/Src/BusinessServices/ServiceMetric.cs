using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceMetric : BaseService, IServiceMetric
    {
        private readonly IRepositoryMetric _repositoryMetric;
        private readonly IRepositoryEncyclopediaEntity _repositoryEncyclopediaEntity;

        public ServiceMetric(IRepositoryMetric repositoryMetric, IRepositoryEncyclopediaEntity repositoryEncyclopediaEntity)
        {
            _repositoryMetric = repositoryMetric;
            _repositoryEncyclopediaEntity = repositoryEncyclopediaEntity;
        }

        public async Task<ServiceResponse<Metric>> GetAllMetrics(IServiceRequest request, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.SelectAll().Select(it => MapMetric(it, languageCode));

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Metric>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricDetails>> GetAllMetricDetails(IServiceRequest request, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var originalIds = _repositoryMetric.GetMetricsWithRelation().Where(it => !string.IsNullOrEmpty(it.Encyclopedia.OriginalEntryId)).Select(it => new Guid(it.Encyclopedia.OriginalEntryId)).ToArray();

                var originalEntities = _repositoryEncyclopediaEntity.SelectAllByIds(originalIds).ToList();

                var data = _repositoryMetric.GetMetricsWithRelation().Select(it => new MetricDetails
                {
                    Metric = MapMetric(it, languageCode),
                    EncyclopediaShortInfo = GetMetricDescription(it.Encyclopedia, originalEntities, languageCode)
                });

                var count = data.Count();

                return new ServiceResponse<MetricDetails>(data.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Metric>> SearchMetrics(IServiceRequest request, string languageCode, string searchKey)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.GetMetrics(searchKey);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<Metric>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Metric>> GetMetricById(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.SelectById(id);

                return new ServiceResponse<Metric>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Metric>> CreateMetric(IServiceRequest request, Metric metric)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.Create(metric);

                _repositoryMetric.Save();

                return new ServiceResponse<Metric>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Metric>> UpdateMetric(IServiceRequest request, Guid id, UpdateMetric metric)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.SelectById(id);

                data.MapChanges(metric);

                _repositoryMetric.Update(data);

                _repositoryMetric.Save();

                return new ServiceResponse<Metric>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<Metric>> DeleteMetric(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetric.Delete(id);

                _repositoryMetric.Save();

                return new ServiceResponse<Metric>(data);
            }).ConfigureAwait(false);
        }

        public static Metric MapMetric(Metric metric, string language)
        {
            if (metric is null)
            {
                throw new ArgumentNullException(nameof(metric));
            }

            return new Metric
            {
                Id = metric.Id,
                Code = metric.Code,
                DefaultAreaFillOpacity = metric.DefaultAreaFillOpacity,
                DefaultBackgroundColor = metric.DefaultBackgroundColor,
                DefaultBackgroundImage = metric.DefaultBackgroundImage,
                DefaultStroke = metric.DefaultStroke,
                DefaultYMax = metric.DefaultYMax,
                DefaultYMin = metric.DefaultYMin,
                DefaultGoal = metric.GetDisplayValue(metric.DefaultGoal, language),
                DefaultGoalMax = metric.GetDisplayValue(metric.DefaultGoalMax, language),
                DefaultGoalMin = metric.GetDisplayValue(metric.DefaultGoalMin, language),
                Type = metric.Type,
                EncyclopediaId = metric.EncyclopediaId,
                UnitEnUs = metric.UnitEnUs,
                UnitUkUa = metric.UnitUkUa,
                UnitBgBg = metric.UnitBgBg,
                Units = metric.GetUnit(language),
                CanBeDisplayedWithOther = metric.CanBeDisplayedWithOther
            };
        }

        private static EncyclopediaShortInfo GetMetricDescription(EncyclopediaEntity metricEncyclopedia, List<EncyclopediaEntity> originalItems, string language)
        {
            EncyclopediaEntity originalEntity = null;
            if (!string.IsNullOrEmpty(metricEncyclopedia.OriginalEntryId))
            {
                originalEntity = originalItems.FirstOrDefault(it => it.Id == new Guid(metricEncyclopedia.OriginalEntryId));
            }

            var description = originalEntity == null ? metricEncyclopedia.GetDescription(language) : originalEntity.GetDescription(language);

            return new EncyclopediaShortInfo
            {
                Id = originalEntity?.Id ?? metricEncyclopedia.Id,
                Title = metricEncyclopedia.GetTitle(language),
                ShortDescription = description.Length > 200 ? description.Substring(0, 200) : description
            };
        }
    }
}
