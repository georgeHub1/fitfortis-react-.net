using System;
using System.Linq;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.DatabaseAccess
{
    public class RepositoryAnalytic : RepositoryGeneric<Analytic, Guid>, IRepositoryAnalytic
    {
        public RepositoryAnalytic(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public QueryResult RunAnalytic(Guid id)
        {
            var analytic = Table.FirstOrDefault(it => it.Id == id);

            QueryResult result = new QueryResult();
            if (analytic != null)
            {
                result = UnitOfWork.RunRawSql(analytic.SqlQuery);
            }

            return result;
        }
    }
}
