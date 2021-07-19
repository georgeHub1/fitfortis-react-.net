using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryUserCondition : IGenericRepository<UserCondition, Guid>
    {
        IQueryable<UserCondition> GetConditionForUser(Guid userId);
        IQueryable<UserCondition> GetUserConditionsByConditions(Guid userId, Guid[] ids);
        IQueryable<UserCondition> GetUserConditionsByEncylopediaIds(Guid userId, IEnumerable<Guid> encyclopediaIds);
    }
}
