using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryMetric : IGenericRepository<Metric, Guid>
    {
        IQueryable<Metric> GetMetrics(string key);
        IQueryable<Metric> GetMetricsWithRelation();
    }
}