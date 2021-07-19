using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryMetric : RepositoryGeneric<Metric, Guid>, IRepositoryMetric
    {
        public RepositoryMetric(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Metric> GetMetrics(string key)
        {
            return Table.Include(it => it.Encyclopedia).Where(it => it.Encyclopedia.TitleEnUs.Contains(key, StringComparison.InvariantCulture) 
                                                                    || it.Code.Contains(key, StringComparison.InvariantCulture));
        }

        public IQueryable<Metric> GetMetricsWithRelation()
        {
            return Table.Include(it => it.Encyclopedia);
        }
    }
}
