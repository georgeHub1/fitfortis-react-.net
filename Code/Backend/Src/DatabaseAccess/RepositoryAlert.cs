using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryAlert : RepositoryGeneric<Alert, Guid>, IRepositoryAlert
    {
        public RepositoryAlert(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
