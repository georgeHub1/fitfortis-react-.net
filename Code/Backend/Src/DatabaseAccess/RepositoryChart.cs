using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryChart : RepositoryGeneric<FitFortisChart, Guid>, IRepositoryChart
    {
        public RepositoryChart(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<FitFortisChart> GetChartsForUser(Guid userId)
        {
            return Table.Include(it => it.ChartMetrics).ThenInclude(cm => cm.Metric).ThenInclude(m => m.Encyclopedia).Where(it => it.UserId == userId);
        }
    }
}
