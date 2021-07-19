using System;
using System.Collections.Generic;
using Backend.Utility;

namespace Backend.Entities
{
    public class Alert : BaseEntity<Guid>
    {
        public string MessageEn { get; set; }
        public string MessageEnUs { get; set; }
        public string MessageUkUa { get; set; }
        public string MessageBgBg { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        public AlertType? Type { get; set; }

        public virtual ICollection<UserAlert> UserAlerts { get; set; }
    }
}
