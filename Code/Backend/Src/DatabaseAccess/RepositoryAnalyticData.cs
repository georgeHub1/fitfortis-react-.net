using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryAnalyticData : RepositoryGeneric<AnalyticData, Guid>, IRepositoryAnalyticData
    {
        public RepositoryAnalyticData(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
