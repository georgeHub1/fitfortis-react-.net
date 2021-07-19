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
    public class ServiceChartMetric : BaseService, IServiceChartMetric
    {
        private readonly IRepositoryChartMetric _repositoryChartMetric;
        private readonly IRepositoryMetric _repositoryMetric;

        public ServiceChartMetric(IRepositoryChartMetric repositoryChartMetric, IRepositoryMetric repositoryMetric)
        {
            _repositoryChartMetric = repositoryChartMetric;
            _repositoryMetric = repositoryMetric;
        }

        public async Task<ServiceResponse<ChartMetric>> GetMetricsForChart(IServiceRequest request, Guid chartId)
        {
            return await ExecuteAsync(() =>
            {
                var user = request.User;
                var data = _repositoryChartMetric.GetMetricsForChart(chartId).Select(it => new ChartMetric
                {
                    Id = it.Id,
                    AnnotateMaxEntry = it.AnnotateMaxEntry,
                    AnnotateLastEntry = it.AnnotateLastEntry,
                    AnnotateMinEntry = it.AnnotateMinEntry,
                    InactiveAt = it.InactiveAt,
                    BackgroundColor = it.BackgroundColor,
                    ChartId = it.ChartId,
                    Stroke = it.Stroke,
                    ShowGoalLines = it.ShowGoalLines,
                    MetricId = it.MetricId,
                    Goal = it.Metric.GetDisplayValue(it.Goal, user.Language),
                    GoalMax = it.Metric.GetDisplayValue(it.GoalMax, user.Language),
                    GoalMin = it.Metric.GetDisplayValue(it.GoalMin, user.Language),

                });

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<ChartMetric>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }
        
        public async Task<ServiceResponse<ChartMetric>> AddDefaultMetricToChart(IServiceRequest request, Guid chartId, Guid metricId)
        {
            return await ExecuteAsync(() =>
            {
                var user = request.User;
                var localMetric = _repositoryMetric.SelectById(metricId);

                var chartMetric = new ChartMetric
                {
                    ChartId = chartId,
                    MetricId = metricId,
                    AnnotateLastEntry = true,
                    AnnotateMaxEntry = true,
                    AnnotateMinEntry = true,
                    ShowGoalLines = true,
                    BackgroundColor = localMetric.DefaultBackgroundColor,
                    Stroke = localMetric.DefaultStroke,
                    Goal = localMetric.DefaultGoal,
                    GoalMax = localMetric.DefaultGoalMax,
                    GoalMin = localMetric.DefaultGoalMin
                };

                _repositoryChartMetric.Create(chartMetric);
                _repositoryChartMetric.Save();

                chartMetric.Goal = localMetric.GetDisplayValue(chartMetric.Goal, user.Language);
                chartMetric.GoalMax = localMetric.GetDisplayValue(chartMetric.GoalMax, user.Language);
                chartMetric.GoalMin = localMetric.GetDisplayValue(chartMetric.GoalMin, user.Language);

                return new ServiceResponse<ChartMetric>(chartMetric);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartMetric>> AddDefaultMetricsToChart(IServiceRequest request, Guid chartId, KeysData<Guid> metricIds)
        {
            return await ExecuteAsync(() =>
            {
                var user = request.User;
                var metrics = _repositoryMetric.SelectAllByIds(metricIds.Keys).ToList();

                var data = CreateChartMetricFromDefault(metrics, chartId, user.Language);

                return new ServiceResponse<ChartMetric>(data, data.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartMetric>> UpdateChartMetric(IServiceRequest request, UpdateChartMetric chartMetric, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var user = request.User;
                var localChartMeric = _repositoryChartMetric.SelectById(id);
                var originalGoal = chartMetric.Goal;
                var originalGoalMax = chartMetric.GoalMax;
                var origianlGoalMin = chartMetric.GoalMin;
                var metric = _repositoryMetric.SelectById(localChartMeric.MetricId);
                

                localChartMeric.MapChanges(chartMetric);

                localChartMeric.Goal = metric.SetValue(localChartMeric.Goal, user.Language);
                localChartMeric.GoalMax = metric.SetValue(localChartMeric.GoalMax, user.Language);
                localChartMeric.GoalMin = metric.SetValue(localChartMeric.GoalMin, user.Language);

                _repositoryChartMetric.Update(localChartMeric);
                _repositoryChartMetric.Save();

                localChartMeric.Goal = originalGoal;
                localChartMeric.GoalMax = originalGoalMax;
                localChartMeric.GoalMin = origianlGoalMin;
                return new ServiceResponse<ChartMetric>(localChartMeric);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartMetric>> RemoveMetricFromChart(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryChartMetric.Delete(id);

                _repositoryChartMetric.Save();

                return new ServiceResponse<ChartMetric>(data);
            }).ConfigureAwait(false);
        }

        private List<ChartMetric> CreateChartMetricFromDefault(List<Metric> metrics, Guid chartId, string language)
        {
            var result = new List<ChartMetric>();

            foreach (var metric in metrics)
            {
                var chartMetric = new ChartMetric
                {
                    ChartId = chartId,
                    MetricId = metric.Id,
                    AnnotateLastEntry = true,
                    AnnotateMaxEntry = true,
                    AnnotateMinEntry = true,
                    ShowGoalLines = true,
                    BackgroundColor = metric.DefaultBackgroundColor,
                    Stroke = metric.DefaultStroke,
                    Goal = metric.DefaultGoal,
                    GoalMax = metric.DefaultGoalMax,
                    GoalMin = metric.DefaultGoalMin
                };

                _repositoryChartMetric.Create(chartMetric);
                _repositoryChartMetric.Save();

                chartMetric.Goal = metric.GetDisplayValue(chartMetric.Goal, language);
                chartMetric.GoalMax = metric.GetDisplayValue(chartMetric.GoalMax, language);
                chartMetric.GoalMin = metric.GetDisplayValue(chartMetric.GoalMin, language);

                result.Add(chartMetric);
            }

            return result;
        }
    }
}
