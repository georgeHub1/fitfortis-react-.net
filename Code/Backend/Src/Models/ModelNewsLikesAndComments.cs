using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelNewsLikesAndComments : BaseEntityModel<Guid>
    {
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public NewsRecordType Type { get; set; }

        public Guid UserId { get; set; }
        public Guid NewsId { get; set; }
    }
}
