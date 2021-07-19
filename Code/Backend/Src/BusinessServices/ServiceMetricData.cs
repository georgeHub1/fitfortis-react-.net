using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;

namespace Backend.BusinessServices
{

    public class ServiceMetricData : BaseService, IServiceMetricData
    {
        private readonly IRepositoryMetricData _repositoryMetricData;
        private readonly IRepositoryMetric _repositoryMetric;
        private readonly IRepositoryUser _repositoryUser;
        public ServiceMetricData(IRepositoryMetricData repositoryMetricData, IRepositoryMetric repositoryMetric, IRepositoryUser repositoryUser)
        {
            _repositoryMetricData = repositoryMetricData;
            _repositoryMetric = repositoryMetric;
            _repositoryUser = repositoryUser;
        }

        public async Task<ServiceResponse<MetricData>> GetMetricData(IServiceRequest request, Guid userId, Guid metricId, MetricDataQueryParams param)
        {
            return await ExecuteAsync(() =>
            {
                var user = _repositoryUser.SelectById(userId);
                var data = _repositoryMetricData.GetMetricDataByUserId(userId, metricId).Select(it => new MetricData
                {
                    Id = it.Id,
                    Date = it.Date,
                    DoctorVisits = it.DoctorVisits,
                    DoctorVisitComments = it.DoctorVisitComments,
                    InactiveAt = it.InactiveAt,
                    LabResults = it.LabResults,
                    LabResultsComments = it.LabResultsComments,
                    Comment = it.Comment,
                    Measurements = it.Measurements,
                    MetricId = it.MetricId,
                    RangeMax = it.RangeMax,
                    RangeMin = it.RangeMin,
                    UserId = it.UserId,
                    Value = it.Metric.GetDisplayValue(it.Value, user.Language)});

                if (param.DateFrom.HasValue)
                {
                    data = data.Where(it => it.Date >= param.DateFrom);
                }

                if (param.DateTo.HasValue)
                {
                    data = data.Where(it => it.Date <= param.DateTo);
                }

                var count = data.Count();


                var pagedData = data.Select(request.Paging, request.Sorting).ToList();

                if (Equals(metricId, Constants.TimelineMetricId))
                {
                    var timelineData = _repositoryMetricData.GetMetricDataForUser(userId)
                        .Where(x => x.MetricId != Constants.TimelineMetricId && x.Value != null)
                        .GroupBy(x => x.Date)
                        .Select(x => new { DateTime = x.Key, Measurements = x.Count() })
                        .ToList();

                    var resultedData = new Dictionary<DateTime, MetricData>();

                    foreach (var point in timelineData)
                    {
                        var date = new DateTime(point.DateTime.Year, point.DateTime.Month, point.DateTime.Day, point.DateTime.Hour, point.DateTime.Minute, point.DateTime.Second);

                        if (!resultedData.ContainsKey(date))
                        {
                            resultedData[date] = new MetricData
                            {
                                MetricId = Constants.TimelineMetricId,
                                UserId = userId,
                                Date = date,
                                Measurements = 0,
                            };
                        }

                        resultedData[date].Measurements = resultedData[date].Measurements + point.Measurements;
                    }
                    foreach (var point in pagedData)
                    {
                        var date = new DateTime(point.Date.Year, point.Date.Month, point.Date.Day, point.Date.Hour, point.Date.Minute, point.Date.Second);

                        if (!resultedData.ContainsKey(date))
                        {
                            resultedData[date] = new MetricData
                            {
                                Id = point.Id,
                                MetricId = Constants.TimelineMetricId,
                                UserId = userId,
                                Date = date,
                                LabResultsComments = point.LabResultsComments,
                                DoctorVisitComments = point.DoctorVisitComments,
                            };
                        }
                        resultedData[date].DoctorVisits = point.DoctorVisits;
                        resultedData[date].LabResults = point.LabResults;
                    }
                    pagedData = resultedData.Values.ToList();
                }

                return new ServiceResponse<MetricData>(pagedData, count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricData>> CreateMetricData(IServiceRequest request, MetricData metricData)
        {
            return await ExecuteAsync(() =>
            {
                var user = _repositoryUser.SelectById(metricData.UserId);
                var metric = _repositoryMetric.SelectById(metricData.MetricId);
                var originalValue = metricData.Value;

                metricData.Value = metric.SetValue(metricData.Value, user.Language);
               
                var data = _repositoryMetricData.Create(metricData);

                _repositoryMetricData.Save();

                data.Value = originalValue;

                return new ServiceResponse<MetricData>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricData>> UpdateMetricData(IServiceRequest request, Guid id, UpdateMetricData metricData)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetricData.SelectById(id);
                var user = _repositoryUser.SelectById(data.UserId);
                var metric = _repositoryMetric.SelectById(data.MetricId);
                var originalValue = metricData.Value;
               

                data.MapChanges(metricData);

                data.Value = metric.SetValue(data.Value, user.Language);
                

                _repositoryMetricData.Update(data);
                _repositoryMetricData.Save();

                data.Value = originalValue;

                return new ServiceResponse<MetricData>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricData>> UpsertMetricData(IServiceRequest request, Guid userId, UpsertMetricData metricData)
        {
            return await ExecuteAsync(() =>
            {
                var result = new List<MetricData>();

                if (metricData.MetricData.Length == 0)
                {
                    return new ServiceResponse<MetricData>(result, result.Count);
                }

                var metrics = _repositoryMetric.SelectAllByIds(metricData.MetricData.Select(it => it.MetricId)).ToDictionary(it => it.Id, it => it);
                var user = _repositoryUser.SelectById(userId);

                var dateTime = metricData.MetricData[0].Date;

                var points = _repositoryMetricData.GetMetricDataByUserIdAndDateTime(userId, dateTime).ToList();

                var pointsToDelete = new List<Guid>();
                var pointsToUpdate = new List<MetricData>();
                var pointsToInsert = new List<MetricData>();

                foreach (var shortMetricData in metricData.MetricData)
                {
                    var point = points.FirstOrDefault(x => x.MetricId == shortMetricData.MetricId);
                    if (shortMetricData.Id.HasValue)
                    {
                        var existedPoint = _repositoryMetricData.SelectById(shortMetricData.Id.Value);

                        if (existedPoint.Date == shortMetricData.Date)
                        {
                            if (shortMetricData.Value.HasValue)
                            {
                                existedPoint.Date = shortMetricData.Date;
                                existedPoint.Value = metrics[shortMetricData.MetricId].SetValue(shortMetricData.Value, user.Language);
                                existedPoint.MetricId = shortMetricData.MetricId;
                                existedPoint.Comment = shortMetricData.Comment;

                                pointsToUpdate.Add(existedPoint);
                            }
                            else
                            {
                                pointsToDelete.Add(shortMetricData.Id.Value);
                            }
                        }
                        else
                        {
                            if (point != null && shortMetricData.Value.HasValue)
                            {
                                pointsToDelete.Add(shortMetricData.Id.Value);

                                point.Date = shortMetricData.Date;
                                point.Value = metrics[shortMetricData.MetricId].SetValue(shortMetricData.Value, user.Language);
                                point.MetricId = shortMetricData.MetricId;
                                point.Comment = shortMetricData.Comment;

                                pointsToUpdate.Add(point);
                            }
                            else if (point == null && shortMetricData.Value.HasValue)
                            {
                                pointsToDelete.Add(shortMetricData.Id.Value);
                                var data = new MetricData
                                {
                                    UserId = userId,
                                    MetricId = shortMetricData.MetricId,
                                    Date = shortMetricData.Date,
                                    Value = metrics[shortMetricData.MetricId].SetValue(shortMetricData.Value, user.Language),
                                    Comment = shortMetricData.Comment
                            };

                                pointsToInsert.Add(data);
                            }
                            else if (point == null && !shortMetricData.Value.HasValue) {
                                pointsToDelete.Add(shortMetricData.Id.Value);
                            }
                        }
                    }
                    else
                    {
                        if (point != null && shortMetricData.Value.HasValue)
                        {
                            point.Date = shortMetricData.Date;
                            point.Value = metrics[shortMetricData.MetricId].SetValue(shortMetricData.Value, user.Language);
                            point.MetricId = shortMetricData.MetricId;
                            point.Comment = shortMetricData.Comment;

                            pointsToUpdate.Add(point);
                        }
                        else if (point == null && shortMetricData.Value.HasValue)
                        {
                            var data = new MetricData
                            {
                                UserId = userId,
                                MetricId = shortMetricData.MetricId,
                                Date = shortMetricData.Date,
                                Value = metrics[shortMetricData.MetricId].SetValue(shortMetricData.Value, user.Language),
                                Comment = shortMetricData.Comment
                        };

                            pointsToInsert.Add(data);
                        }
                    }
                }

                foreach (var item in pointsToDelete)
                {
                    _repositoryMetricData.Delete(item);
                }
                foreach (var item in pointsToInsert)
                {
                    _repositoryMetricData.Create(item);
                }
                foreach (var item in pointsToUpdate)
                {
                    _repositoryMetricData.Update(item);
                }

                _repositoryMetricData.Save();

                result = _repositoryMetricData.GetMetricDataByUserIdAndDateTime(userId, dateTime).Select(it => new MetricData
                {
                    Id = it.Id,
                    Date = it.Date,
                    DoctorVisits = it.DoctorVisits,
                    DoctorVisitComments = it.DoctorVisitComments,
                    InactiveAt = it.InactiveAt,
                    LabResults = it.LabResults,
                    LabResultsComments = it.LabResultsComments,
                    Measurements = it.Measurements,
                    MetricId = it.MetricId,
                    RangeMax = it.RangeMax,
                    RangeMin = it.RangeMin,
                    UserId = it.UserId,
                    Comment = it.Comment,
                    Value = it.Metric.GetDisplayValue(it.Value, user.Language)
                }).ToList();
                return new ServiceResponse<MetricData>(result, result.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricData>> DeleteMetricData(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryMetricData.Delete(id);
                _repositoryMetricData.Save();

                return new ServiceResponse<MetricData>(data);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<MetricData>> DeleteMetricDataBulk(IServiceRequest request, List<Guid> metricDataIds)
        {
            return await ExecuteAsync(() =>
            {
                var result = new List<MetricData>();

                foreach (var item in metricDataIds)
                {
                    var data = _repositoryMetricData.Delete(item);
                    result.Add(data);
                }

                _repositoryMetricData.Save();

                return new ServiceResponse<MetricData>(result, result.Count);
            }).ConfigureAwait(false);
        }
    }
}
