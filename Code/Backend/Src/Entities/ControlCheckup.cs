using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class ControlCheckup : BaseEntity<Guid>
    {
        public string FrequencyEnUs { get; set; }
        public string FrequencyEn { get; set; }
        public string FrequencyUkUa { get; set; }
        public string FrequencyBgBg { get; set; }
        public string ProfilacticCheckupEnUs { get; set; }
        public string ProfilacticCheckupEn { get; set; }
        public string ProfilacticCheckupUkUa { get; set; }
        public string ProfilacticCheckupBgBg { get; set; }
        public int? MinAge { get; set; }
        public int? MaxAge { get; set; }
        public string ChronicConditions { get; set; }
        public string FamilyHistory { get; set; }
        public string PropertyValues { get; set; }
        public string UserProperty { get; set; }
        public CheckupGender Gender { get; set; }
    }
}
