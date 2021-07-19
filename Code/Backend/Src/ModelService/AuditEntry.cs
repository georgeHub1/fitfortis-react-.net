using System;
using System.Collections.Generic;
using Backend.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Internal;
using Newtonsoft.Json;

namespace Backend.ModelService
{
    public class AuditEntry
    {
        public EntityEntry Entry { get; }
        public string TableName { get; set; }
        public string Action { get; set; }
        public Guid? UserId { get; set; }
        public Dictionary<string, object> KeyValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> OldValues { get; } = new Dictionary<string, object>();
        public Dictionary<string, object> NewValues { get; } = new Dictionary<string, object>();
        public List<PropertyEntry> TemporaryProperties { get; } = new List<PropertyEntry>();

        public bool HasTemporaryProperties => TemporaryProperties.Any();

        public AuditEntry(EntityEntry entry)
        {
            Entry = entry;
        }

        public Audit ToAudit()
        {
            var audit = new Audit
            {
                TableName = TableName,
                Action = Action,
                ActionDate = DateTime.UtcNow,
                UserId = UserId,
                KeyValues = JsonConvert.SerializeObject(KeyValues),
                OldValues = OldValues.Count == 0 ? null : JsonConvert.SerializeObject(OldValues),
                NewValues = NewValues.Count == 0 ? null : JsonConvert.SerializeObject(NewValues)
            };


            return audit;
        }
    }
}