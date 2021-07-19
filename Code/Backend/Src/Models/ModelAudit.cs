using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAudit : BaseEntityModel<Guid>
    {
        public string TableName { get; set; }
        public DateTime ActionDate { get; set; }
        public string Action { get; set; }
        public string KeyValues { get; set; }
        public string OldValues { get; set; }
        public string NewValues { get; set; }

        public Guid UserId { get; set; }
    }
}