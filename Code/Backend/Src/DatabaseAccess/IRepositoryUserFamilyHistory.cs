using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryUserFamilyHistory : IGenericRepository<UserFamilyHistory, Guid>
    {
        IQueryable<UserFamilyHistory> GetUserFamilyHistory(Guid userId);
        IQueryable<UserFamilyHistory> GetFamilyHistoryByHistoryIds(Guid userId, Guid[] familyHistoryIds);
        IQueryable<UserFamilyHistory> GetUserFamilyHistoryByEncylopediaIds(Guid userId, IEnumerable<Guid> encyclopediaIds);
    }
}
