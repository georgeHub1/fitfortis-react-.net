using System;
using System.Collections.Generic;
using Backend.Utility;

namespace Backend.Entities
{
    public class ChronicCondition : BaseEntity<Guid>
    { 
        public ConditionCategory Category { get; set; }
        public GenderApplicability? GenderApplicability { get; set; }
        public Guid EncyclopediaId { get; set; }
        public float HealthIndexAmount { get; set; }

        public virtual EncyclopediaEntity Encyclopedia { get; set; }

        public virtual ICollection<UserCondition> UserConditions { get; set; }
    }
}
