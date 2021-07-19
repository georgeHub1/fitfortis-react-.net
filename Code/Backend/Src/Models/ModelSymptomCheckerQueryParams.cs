using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelSymptomCheckerQueryParams : BaseEntityModel
    {
        [AttributeBindingMember("applicableToMale")]
        public bool? ApplicableToMale { get; set; }
        [AttributeBindingMember("applicableToFemale")]
        public bool? ApplicableToFemale { get; set; }
        [AttributeBindingMember("applicableToFemalePregnant")]
        public bool? ApplicableToFemalePregnant { get; set; }
        [AttributeBindingMember("minAgeOfApplicability")]
        public int? MinAgeOfApplicability { get; set; }
        [AttributeBindingMember("maxAgeOfApplicability")]
        public int? MaxAgeOfApplicability { get; set; }
    }
}