using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryUserCondition : RepositoryGeneric<UserCondition, Guid>, IRepositoryUserCondition
    {
        public RepositoryUserCondition(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<UserCondition> GetConditionForUser(Guid userId)
        {
            return Table.Where(it => it.UserId == userId);
        }

        public IQueryable<UserCondition> GetUserConditionsByConditions(Guid userId, Guid[] ids)
        {
            return Table.Where(it => it.UserId == userId && ids.Contains(it.ChronicConditionId));
        }

        public IQueryable<UserCondition> GetUserConditionsByEncylopediaIds(Guid userId, IEnumerable<Guid> encyclopediaIds)
        {
            return Table.Include(it => it.ChronicCondition).Where(it => it.UserId == userId && encyclopediaIds.Contains(it.ChronicCondition.EncyclopediaId));
        }
    }
}
