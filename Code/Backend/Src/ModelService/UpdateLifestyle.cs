using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class UpdateLifestyle : BaseEntity
    {
        public Diet? Diet { get; set; }
        public Sport? Sports { get; set; }
        public Alcohol? Alcohol { get; set; }
        public TobaccoConsumption? Tobacco { get; set; }
        public DateTime? QuitDate { get; set; }
        public YesNo? SexuallyActive { get; set; }
        public YesNo? HighPromiscuity { get; set; }
    }
}
