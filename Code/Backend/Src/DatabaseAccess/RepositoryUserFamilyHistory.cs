using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryUserFamilyHistory : RepositoryGeneric<UserFamilyHistory, Guid>, IRepositoryUserFamilyHistory
    {
        public RepositoryUserFamilyHistory(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<UserFamilyHistory> GetUserFamilyHistory(Guid userId)
        {
            return Table.Where(it => it.UserId == userId);
        }

        public IQueryable<UserFamilyHistory> GetFamilyHistoryByHistoryIds(Guid userId, Guid[] familyHistoryIds)
        {
            return Table.Where(it => it.UserId == userId && familyHistoryIds.Contains(it.FamilyHistoryId));
        }

        public IQueryable<UserFamilyHistory> GetUserFamilyHistoryByEncylopediaIds(Guid userId, IEnumerable<Guid> encyclopediaIds)
        {
            return Table.Include(it => it.FamilyHistory).Where(it => it.UserId == userId && encyclopediaIds.Contains(it.FamilyHistory.EncyclopediaId));
        }
    }
}
