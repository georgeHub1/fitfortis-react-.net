using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryUserLoginStats : RepositoryGeneric<AnalyticUserSignIn, Guid>, IRepositoryUserLoginStats
    {
        public RepositoryUserLoginStats(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
