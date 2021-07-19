using Backend.Entities;

namespace Backend.ModelService
{
    public class SymptomCheckerQueryParams : BaseEntity
    {
        public bool? ApplicableToMale { get; set; }
        public bool? ApplicableToFemale { get; set; }
        public bool? ApplicableToFemalePregnant { get; set; }
        public int? MinAgeOfApplicability { get; set; }
        public int? MaxAgeOfApplicability { get; set; }
    }
}