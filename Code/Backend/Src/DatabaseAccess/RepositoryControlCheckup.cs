using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryControlCheckup : RepositoryGeneric<ControlCheckup, Guid>, IRepositoryControlCheckup
    {
        public RepositoryControlCheckup(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
