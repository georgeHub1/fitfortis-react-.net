using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryChartMetric : RepositoryGeneric<ChartMetric, Guid>, IRepositoryChartMetric
    {
        public RepositoryChartMetric(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<ChartMetric> GetMetricsForChart(Guid chartId)
        {
            return Table.Include(it => it.Metric).Where(it => it.ChartId == chartId);
        }
    }
}
