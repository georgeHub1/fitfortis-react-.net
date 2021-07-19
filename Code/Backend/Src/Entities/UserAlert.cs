using System;

namespace Backend.Entities
{
    public class UserAlert : BaseEntity<Guid>
    {
        public bool IsRead { get; set; }
        public bool Hide { get; set; }
        public DateTime? SnoozeTill { get; set; }

        public Guid UserId { get; set; }
        public Guid AlertId { get; set; }

        public virtual User User { get; set; }
        public virtual Alert Alert { get; set; }
    }
}
