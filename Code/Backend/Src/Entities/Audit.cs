using System;

namespace Backend.Entities
{
    public class Audit : BaseEntity<Guid>
    {
        public string TableName { get; set; }
        public DateTime ActionDate { get; set; }
        public string Action { get; set; }
        public string KeyValues { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }
        
        public Guid? UserId { get; set; }

        public virtual User User { get; set; }
    }
}