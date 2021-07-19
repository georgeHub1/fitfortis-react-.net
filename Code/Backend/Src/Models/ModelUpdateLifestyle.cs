using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelUpdateLifestyle : BaseEntityModel
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
