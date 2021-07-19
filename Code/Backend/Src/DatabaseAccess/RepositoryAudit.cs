using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryAudit : RepositoryGeneric<Audit, Guid>, IRepositoryAudit
    {
        public RepositoryAudit(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Audit> GetUsersActivity(Guid userId)
        {
            return Table.Where(it => it.UserId == userId);
        }
    }
}