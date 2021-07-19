using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelMetric : BaseEntityModel<Guid>
    {
        public string Code { get; set; }
        public string DefaultYMin { get; set; }
        public string DefaultYMax { get; set; }
        public string DefaultBackgroundColor { get; set; }
        public string DefaultBackgroundImage { get; set; }
        public string DefaultAreaFillOpacity { get; set; }
        public string DefaultStroke { get; set; }
        public string UnitsEnUs { get; set; }
        public string UnitsUkUa { get; set; }
        public string UnitsBgBg { get; set; }
        public float? DefaultGoal { get; set; }
        public float? DefaultGoalMin { get; set; }
        public float? DefaultGoalMax { get; set; }
        public string UnitEn { get; set; }
        public string UnitEnConversionToSi { get; set; }
        public MetricType Type { get; set; }
        public Guid? EncyclopediaId { get; set; }
        public string Units { get; set; }
        public bool CanBeDisplayedWithOther { get; set; }
    }
}
