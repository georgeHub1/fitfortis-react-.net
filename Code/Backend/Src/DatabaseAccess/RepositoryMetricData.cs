using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryMetricData : RepositoryGeneric<MetricData, Guid>, IRepositoryMetricData
    {
        public RepositoryMetricData(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<MetricData> GetMetricDataByUserId(Guid userId, Guid metricId)
        {
            return Table.Where(it => it.UserId == userId && it.MetricId == metricId);
        }

        public IQueryable<MetricData> GetMetricDataByUserIdAndDateTime(Guid userId, DateTime dateTime)
        {
            return Table.Where(it => it.UserId == userId && it.Date == dateTime);
        }

        public IQueryable<MetricData> GetMetricDataForUser(Guid userId)
        {
            return Table.Include(it => it.Metric).Where(it => it.UserId == userId);
        }
    }
}
