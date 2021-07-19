using System;
using Backend.DatabaseAccess;

namespace Backend.Entities
{
    public class UserFamilyHistory : BaseEntity<Guid>
    {
        public Guid UserId { get; set; }
        public Guid FamilyHistoryId { get; set; }
        public DateTime? Date { get; set; }

        public virtual User User { get; set; }
        public virtual FamilyHistory FamilyHistory { get; set; }
    }
}