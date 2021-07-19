using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelUser : BaseEntityModel<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public SexAtBirthType? SexAtBirth { get; set; }
        public GenderType? GenderIdentity { get; set; }
        public EthnicOriginType? EthnicOrigin { get; set; }
        public string Language { get; set; }

        //Lifestyle
        [JsonConverter(typeof(StringEnumConverter))]
        public Diet? Diet { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Sport? Sports { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public Alcohol? Alcohol { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public TobaccoConsumption? TobaccoConsumption { get; set; }
        public DateTime? QuitDate { get; set; }

        public int BiologicalChildren { get; set; }
        public int NonBiologicalChildren { get; set; }

        // Female only
        [JsonConverter(typeof(StringEnumConverter))]
        public YesNo? Pregnancy { get; set; }
        public DateTime? PregnantDueDate { get; set; }
        public DateTime? FirstPregnancyDate { get; set; }
        public DateTime? LastPregnancy { get; set; }

        public Guid? AvatarId { get; set; }
        public DateTime CreateAccountDate { get; set; }
        public DateTime? EmailConfirmedDate { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public BloodGroupType? BloodGroup { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public RhType? RhFactor { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public YesNo? SexualActive { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public YesNo? HighPromiscuity { get; set; }
    }
}
