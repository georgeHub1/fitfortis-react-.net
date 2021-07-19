using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelAlert : BaseEntityModel<Guid>
    {
        public string MessageEnUs { get; set; }
        public string MessageUkUa { get; set; }
        public string MessageBgBg { get; set; }
        public DateTime CreationDate { get; set; }
        public DateTime ExecutionDate { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public AlertType? Type { get; set; }
    }
}
