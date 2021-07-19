using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Utility;
using Microsoft.AspNetCore.Identity;


namespace Backend.Entities
{
    public class User : IdentityUser<Guid>, IBaseEntity<Guid>, IIdentifiable<Guid>, IInactivebleAt
    {
        [Required]
        [StringLength(128)]
        [AttributeEncrypted]
        public string FirstName { get; set; }
        [Required]
        [StringLength(128)]
        [AttributeEncrypted]
        public string LastName { get; set; }
        [AttributeEncrypted]
        public override string UserName { get; set; }
        [AttributeEncrypted]
        public override string NormalizedUserName { get; set; }
        [AttributeEncrypted]
        public override string Email { get; set; }
        [AttributeEncrypted]
        public override string NormalizedEmail { get; set; }

        public DateTime? DateOfBirth { get; set; }
        
        public SexAtBirthType? SexAtBirth { get; set; }
        public GenderType? GenderIdentity { get; set; }
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
        public YesNo? Pregnancy { get; set; }
        public DateTime? PregnantDueDate { get; set; }
        public DateTime? FirstPregnancyDate { get; set; }
        public DateTime? LastPregnancy { get; set; }
        public YesNo? SexuallyActive { get; set; }
        public YesNo? HighPromiscuity { get; set; }

        public Guid? AvatarId { get; set; }
        public DateTime CreateAccountDate { get; set; }
        public DateTime? EmailConfirmedDate { get; set; }

        public BloodGroupType? BloodGroup { get; set; }
        public RhType? RhFactor { get; set; }

        [Column(TypeName = "datetime2", Order = 101)]
        public DateTime? InactiveAt { get; set; }
        [NotMapped]
        public string EmailConfirmationToken { get; set; }
        [NotMapped]
        public bool HasPassword => !string.IsNullOrEmpty(PasswordHash);
        [NotMapped]
        public string DisplayName => $"{FirstName} {LastName}";

        public virtual ICollection<MetricData> MetricData { get; set; }
        public virtual ICollection<FitFortisChart> Charts { get; set; }
        public virtual ICollection<Audit> Audits { get; set; }
        public virtual ICollection<SearchRequest> SearchRequests { get; set; }
        public virtual ICollection<ExceptionLog> ExceptionLogs { get; set; }
        public virtual ICollection<UserFamilyHistory> UserFamilyHistory { get; set; }
        public virtual ICollection<UserCondition> UserConditions { get; set; }
        public virtual ICollection<UserVaccineTherapy> UserVaccineTherapies { get; set; }
        public virtual ICollection<Document> Documents { get; set; }
        public virtual ICollection<NewsLikesAndComments> LikesAndComments { get; set; }
        public virtual ICollection<UserAlert> Alerts { get; set; }
        public virtual ICollection<AnalyticUserSignIn> AnalyticUserSignIn { get; set; }
    }
}
