using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class SymptomChecker : BaseEntity<Guid>
    {
        public Guid? EncyclopediaEntrySymptomId { get; set; }
        public Guid? EncyclopediaEntryPossibleCauseOrDiagnosisId { get; set; }
        public bool ApplicableToMale { get; set; }
        public bool ApplicableToFemale { get; set; }
        public bool ApplicableToFemalePregnant { get; set; }
        public int MinAgeOfApplicability { get; set; }
        public int MaxAgeOfApplicability { get; set; }

        [ForeignKey("EncyclopediaEntrySymptomId")]
        public virtual EncyclopediaEntity Symptom { get; set; }
        [ForeignKey("EncyclopediaEntryPossibleCauseOrDiagnosisId")]
        public virtual EncyclopediaEntity Diagnosis { get; set; }

    }
}
