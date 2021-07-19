using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;
using Backend.Utility;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryChronicCondition : RepositoryGeneric<ChronicCondition, Guid>, IRepositoryChronicCondition
    {
        public RepositoryChronicCondition(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<ChronicCondition> GetChronicConditions(SexAtBirthType? sexAtBirthType)
        {
            if (sexAtBirthType.HasValue && sexAtBirthType == SexAtBirthType.Male)
            {
                return Table.Where(it => it.GenderApplicability != GenderApplicability.FemaleOnly);
            }

            if (sexAtBirthType.HasValue && sexAtBirthType == SexAtBirthType.Female)
            {
                return Table.Where(it => it.GenderApplicability != GenderApplicability.MaleOnly);
            }

            return Table;
        }

        public IQueryable<ChronicCondition> GetChronicConditionsByEncyclopediaId(IEnumerable<Guid> encyclopediaIds)
        {
            return Table.Where(it => encyclopediaIds.Contains(it.EncyclopediaId));
        }
    }
}
