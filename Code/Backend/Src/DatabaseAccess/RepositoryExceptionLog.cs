using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryExceptionLog : RepositoryGeneric<ExceptionLog, Guid>, IRepositoryExceptionLog
    {
        public RepositoryExceptionLog(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}