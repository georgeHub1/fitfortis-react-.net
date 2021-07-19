using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryFamilyHistory : RepositoryGeneric<FamilyHistory, Guid>, IRepositoryFamilyHistory
    {
        public RepositoryFamilyHistory(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<FamilyHistory> GetUserFamilyHistory()
        {
            return Table.Include(it => it.Encyclopedia);
        }

        public IQueryable<FamilyHistory> GetFamilyHistoryByEncyclopediaId(IEnumerable<Guid> encyclopediaIds)
        {
            return Table.Where(it => encyclopediaIds.Contains(it.EncyclopediaId));
        }
    }
}
