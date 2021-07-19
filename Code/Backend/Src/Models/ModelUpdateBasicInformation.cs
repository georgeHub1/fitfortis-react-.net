using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelUpdateBasicInformation : BaseEntityModel
    {
        public SexAtBirthType? SexAtBirth { get; set; }
        public GenderType? GenderIdentity { get; set; }
        public EthnicOriginType? EthnicOrigin { get; set; }
        public BloodGroupType? BloodGroup { get; set; }
        public RhType? RhFactor { get; set; }
        public YesNo? Pregnancy { get; set; }
    }
}
