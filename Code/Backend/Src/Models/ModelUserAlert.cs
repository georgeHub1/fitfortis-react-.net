using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserAlert : BaseEntityModel<Guid>
    {
        public bool IsRead { get; set; }
        public bool Hide { get; set; }
        public DateTime? SnoozeTill { get; set; }

        public Guid UserId { get; set; }
        public Guid AlertId { get; set; }
    }
}
