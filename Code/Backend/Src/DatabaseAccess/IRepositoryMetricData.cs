using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryMetricData : IGenericRepository<MetricData, Guid>
    {
        IQueryable<MetricData> GetMetricDataByUserId(Guid userId, Guid metricId);
        IQueryable<MetricData> GetMetricDataByUserIdAndDateTime(Guid userId, DateTime dateTime);
        IQueryable<MetricData> GetMetricDataForUser(Guid userId);
    }
}
