using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Backend.Utility;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryChronicCondition : IGenericRepository<ChronicCondition, Guid>
    {
        IQueryable<ChronicCondition> GetChronicConditions(SexAtBirthType? sexAtBirthType);
        IQueryable<ChronicCondition> GetChronicConditionsByEncyclopediaId(IEnumerable<Guid> encyclopediaIds);

    }
}
