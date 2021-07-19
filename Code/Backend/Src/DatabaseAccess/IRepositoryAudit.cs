using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryAudit : IGenericRepository<Audit, Guid>
    {
        IQueryable<Audit> GetUsersActivity(Guid userId);
    }
}