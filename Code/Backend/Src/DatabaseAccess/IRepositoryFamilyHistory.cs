using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryFamilyHistory : IGenericRepository<FamilyHistory, Guid>
    {
        IQueryable<FamilyHistory> GetUserFamilyHistory();
        IQueryable<FamilyHistory> GetFamilyHistoryByEncyclopediaId(IEnumerable<Guid> encyclopediaIds);
    }
}
