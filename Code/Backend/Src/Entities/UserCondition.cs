using System;
using System.Collections.Generic;

namespace Backend.Entities
{
    public class UserCondition : BaseEntity<Guid>
    {
        public Guid UserId { get; set; }
        public Guid ChronicConditionId { get; set; }

        public virtual User User { get; set; }
        public virtual ChronicCondition ChronicCondition { get; set; }
    }
}