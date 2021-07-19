using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelFamilyHistory : BaseEntityModel<Guid>
    {
        public string Name { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public HistoryCategory Category { get; set; }
    }
}