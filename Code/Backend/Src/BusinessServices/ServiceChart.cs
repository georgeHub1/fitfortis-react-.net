using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public class ServiceChart : BaseService, IServiceChart
    {
        private readonly IRepositoryChart _repositoryChart;
        private readonly IRepositoryChartMetric _repositoryChartMetric;
        private readonly IRepositoryMetricData _repositoryMetricData;
        private readonly IRepositoryMetric _repositoryMetric;
        private readonly IRepositoryUser _repositoryUser;

        public ServiceChart(IRepositoryChart repositoryChart, IRepositoryChartMetric repositoryChartMetric, IRepositoryMetric repositoryMetric,
            IRepositoryMetricData repositoryMetricData, IRepositoryUser repositoryUser)
        {
            _repositoryChart = repositoryChart;
            _repositoryChartMetric = repositoryChartMetric;
            _repositoryMetricData = repositoryMetricData;
            _repositoryMetric = repositoryMetric;
            _repositoryUser = repositoryUser;
        }

        public async Task<ServiceResponse<FitFortisChart>> GetAllChartsForUser(IServiceRequest request, Guid userId)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryChart.GetChartsForUser(userId);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<FitFortisChart>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartDetails>> GetChartDetailsForUser(IServiceRequest request, Guid userId, string language)
        {
            return await ExecuteAsync(() =>
            {
                var metricData = _repositoryMetricData.GetMetricDataForUser(userId).Select(it => new MetricData
                {
                    Id = it.Id,
                    Date = it.Date,
                    DoctorVisits = it.DoctorVisits,
                    InactiveAt = it.InactiveAt,
                    LabResults = it.LabResults,
                    Measurements = it.Measurements,
                    DoctorVisitComments = it.DoctorVisitComments,
                    LabResultsComments = it.LabResultsComments,
                    Comment = it.Comment,
                    MetricId = it.MetricId,
                    RangeMax = it.RangeMax,
                    RangeMin = it.RangeMin,
                    UserId = it.UserId,
                    Value = it.Metric.GetDisplayValue(it.Value, language)

                }).GroupBy(it => it.MetricId).ToDictionary(it => it.Key, it => it.ToList());

                var data = _repositoryChart.GetChartsForUser(userId).Select(it => new ChartDetails
                {
                    Chart = it,
                    ChartMetricDetails = it.ChartMetrics.Select(cm => new ChartMetricDetails
                    {
                        Name = cm.Metric.Encyclopedia.GetTitle(language),
                        Description = cm.Metric.Encyclopedia.GetDescription(language),
                        ChartMetric = MapChartMetric(cm, cm.Metric, language),
                        DefaultMetric = ServiceMetric.MapMetric(cm.Metric, language),
                        MetricData = metricData.ContainsKey(cm.MetricId) ? metricData[cm.MetricId] : new List<MetricData>()
                    }).ToList()
                }).ToList();

                var count = data.Count;

                return new ServiceResponse<ChartDetails>(data, count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<FitFortisChart>> GetChartById(IServiceRequest request, Guid userId, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryChart.SelectById(id);

                if (data.UserId != userId)
                {
                    EntityNotFoundException.ThrowMe(typeof(FitFortisChart).Name, nameof(IIdentifiable<Guid>.Id), id.ToString());
                }

                return new ServiceResponse<FitFortisChart>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<FitFortisChart>> CreateChart(IServiceRequest request, FitFortisChart chart)
        {
            return await ExecuteAsync(() =>
            {
                chart.Name = null;
                _repositoryChart.Create(chart);
                _repositoryChart.Save();

                return new ServiceResponse<FitFortisChart>(chart);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartDetails>> CreateChartWithMetric(IServiceRequest request, CreateCharWithMetrric chart)
        {
            return await ExecuteAsync(() =>
            {
                var defaultMetric = _repositoryMetric.SelectById(chart.MetricId);
                var user = _repositoryUser.SelectById(chart.UserId);

                var newChart = new FitFortisChart
                {
                    UserId = chart.UserId,
                };

                newChart = _repositoryChart.Create(newChart);
                var chartMetric = _repositoryChartMetric.Create(new ChartMetric
                {
                    ChartId = newChart.Id,
                    MetricId = chart.MetricId,
                    AnnotateLastEntry = true,
                    AnnotateMaxEntry = true,
                    AnnotateMinEntry = true,
                    ShowGoalLines = true,
                    BackgroundColor = defaultMetric.DefaultBackgroundColor,
                    Stroke = defaultMetric.DefaultStroke,
                    Goal = defaultMetric.DefaultGoal,
                    GoalMax = defaultMetric.DefaultGoalMax,
                    GoalMin = defaultMetric.DefaultGoalMin

                });

                _repositoryChart.Save();

                var chartDetails = new ChartDetails
                {
                    Chart = newChart,
                    ChartMetricDetails = new List<ChartMetricDetails> {
                        new ChartMetricDetails{
                            ChartMetric=MapChartMetric(chartMetric, defaultMetric, user.Language),
                            DefaultMetric=ServiceMetric.MapMetric(defaultMetric, user.Language),
                            MetricData = new List<MetricData>(),
                            Name = newChart.Name
                        }
                    }
                };

                return new ServiceResponse<ChartDetails>(chartDetails);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<ChartDetails>> CreateChartWithMetrics(IServiceRequest request, CreateCharWithMetrric chart)
        {
            return await ExecuteAsync(() =>
            {
                List<ChartMetricDetails> chartMetricDetails = new List<ChartMetricDetails>();

                var defaultMetrics = _repositoryMetric.SelectAllByIds(chart.MetricIds).ToList();
                var user = _repositoryUser.SelectById(chart.UserId);

                var newChart = new FitFortisChart
                {
                    UserId = chart.UserId,
                };

                newChart = _repositoryChart.Create(newChart);

                foreach (var defaultMetric in defaultMetrics)
                {
                    var chartMetric = _repositoryChartMetric.Create(CreateDefaultMetric(defaultMetric, newChart.Id));

                    chartMetricDetails.Add(new ChartMetricDetails
                    {
                        ChartMetric = MapChartMetric(chartMetric, defaultMetric, user.Language),
                        DefaultMetric = ServiceMetric.MapMetric(defaultMetric, user.Language),
                        MetricData = new List<MetricData>(),
                        Name = newChart.Name
                    });
                }
                _repositoryChart.Save();

                var chartDetails = new ChartDetails
                {
                    Chart = newChart,
                    ChartMetricDetails = chartMetricDetails
                };

                return new ServiceResponse<ChartDetails>(chartDetails);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<FitFortisChart>> UpdateChart(IServiceRequest request, Guid id, UpdateChart chart)
        {
            return await ExecuteAsync(() =>
            {
                var localChart = _repositoryChart.SelectById(id);

                localChart.MapChanges(chart);

                _repositoryChart.Update(localChart);
                _repositoryChart.Save();

                return new ServiceResponse<FitFortisChart>(localChart);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<FitFortisChart>> RemoveChart(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                RemoveChartMetric(id);

                var data = _repositoryChart.Delete(id);

                _repositoryChart.Save();

                return new ServiceResponse<FitFortisChart>(data);
            }).ConfigureAwait(false);
        }

        private void RemoveChartMetric(Guid chartId)
        {
            foreach (var chartMetric in _repositoryChartMetric.SelectAll().Where(it => it.ChartId == chartId).ToList())
            {
                _repositoryChartMetric.Delete(chartMetric.Id);
            }

            _repositoryChartMetric.Save();
        }

        private ChartMetric MapChartMetric(ChartMetric chartMetric, Metric defaulutMetric, string language)
        {
            return new ChartMetric
            {
                Id = chartMetric.Id,
                AnnotateMaxEntry = chartMetric.AnnotateMaxEntry,
                AnnotateLastEntry = chartMetric.AnnotateLastEntry,
                AnnotateMinEntry = chartMetric.AnnotateMinEntry,
                InactiveAt = chartMetric.InactiveAt,
                BackgroundColor = chartMetric.BackgroundColor,
                ChartId = chartMetric.ChartId,
                Stroke = chartMetric.Stroke,
                ShowGoalLines = chartMetric.ShowGoalLines,
                MetricId = chartMetric.MetricId,
                Goal = defaulutMetric.GetDisplayValue(chartMetric.Goal, language),
                GoalMax = defaulutMetric.GetDisplayValue(chartMetric.GoalMax, language),
                GoalMin = defaulutMetric.GetDisplayValue(chartMetric.GoalMin, language)
            };
        }

        private ChartMetric CreateDefaultMetric(Metric metric, Guid chartId)
        {
            return new ChartMetric
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
        }
    }
}
