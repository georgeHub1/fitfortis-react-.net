using System;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class UpdateUser : BaseEntity
    {
        [Required]
        [StringLength(128)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(128)]
        public string LastName { get; set; }
        public SexAtBirthType? SexAtBirth { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public GenderType? Gender { get; set; }
        public EthnicOriginType? EthnicOrigin { get; set; }
        public string Language { get; set; }

        //Lifestyle
        public Diet? Diet { get; set; }
        public Sport? Sports { get; set; }
        public Alcohol? Alcohol { get; set; }
        public TobaccoConsumption? TobaccoConsumption { get; set; }
        public DateTime? QuitDate { get; set; }

        public int BiologicalChildren { get; set; }
        public int NonBiologicalChildren { get; set; }

        // Female only
        public bool? CurrentlyPregnant { get; set; }
        public DateTime? PregnantDueDate { get; set; }
        public DateTime? FirstPregnancyDate { get; set; }
        public DateTime? LastPregnancy { get; set; }

        public Guid? AvatarId { get; set; }
    }
}
