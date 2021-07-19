using System;
using System.Collections.Generic;
using Backend.Utility;

namespace Backend.Entities
{
    public class FamilyHistory : BaseEntity<Guid>
    {
        public HistoryCategory Category { get; set; }
        public Guid EncyclopediaId { get; set; }
        public float HealthIndexAmount { get; set; }

        public virtual EncyclopediaEntity Encyclopedia { get; set; }
        public virtual ICollection<UserFamilyHistory> UserFamilyHistory { get; set; }
    }
}
