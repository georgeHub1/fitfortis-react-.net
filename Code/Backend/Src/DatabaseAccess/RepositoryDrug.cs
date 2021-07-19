using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryDrug : RepositoryGeneric<Drug, Guid>, IRepositoryDrug
    {
        public RepositoryDrug(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }
    }
}
