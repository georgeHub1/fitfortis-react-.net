using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Utility;

namespace Backend.Entities
{
    public class Metric : BaseEntity<Guid>
    {
        [StringLength(128)]
        public string Code { get; set; }
        public Guid? EncyclopediaId { get; set; }
        public MetricType Type { get; set; }
        public ConversionType ConversionType { get; set; }
        public string UnitSi { get; set; }
        [StringLength(128)]
        public string UnitBgBg { get; set; }
        [StringLength(128)]
        public string UnitEnUs { get; set; }
        [StringLength(128)]
        public string UnitUkUa { get; set; }
        public string UnitEn { get; set; }
        public string UnitEnConversionToSi { get; set; }
        public string UnitBgBgConversionToSi { get; set; }
        public string UnitEnUsConversionToSi { get; set; }
        public string UnitUkUaConversionToSi { get; set; }
        [StringLength(128)]
        public string DefaultYMin { get; set; }
        [StringLength(128)]
        public string DefaultYMax { get; set; }
        public float? DefaultGoal { get; set; }
        public float? DefaultGoalMin { get; set; }
        public float? DefaultGoalMax { get; set; }
        public string DefaultStroke { get; set; }
        public string DefaultBackgroundColor { get; set; }
        public string DefaultBackgroundImage { get; set; }
        public string DefaultAreaFillOpacity { get; set; }
        public bool CanBeDisplayedWithOther { get; set; }
        
        

        [NotMapped]
        public string Units { get; set; }

        public virtual EncyclopediaEntity Encyclopedia { get; set; }

        public virtual ICollection<MetricData> MetricData { get; set; }
        public virtual ICollection<ChartMetric> ChartMetrics { get; set; }
 
    }
}
