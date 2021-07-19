using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryChartMetric : IGenericRepository<ChartMetric, Guid>
    {
        IQueryable<ChartMetric> GetMetricsForChart(Guid chartId);
    }
}