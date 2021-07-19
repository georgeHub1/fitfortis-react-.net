using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelChronicCondition : BaseEntityModel<Guid>
    {
        [JsonConverter(typeof(StringEnumConverter))]

        public ConditionCategory Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool? OnlyFemale { get; set; }
        public string LanguageCode { get; set; }
    }
}