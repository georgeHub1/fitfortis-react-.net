using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class UpdateMetric : BaseEntity
    {
        public string Code { get; set; }
        public string UnitsEnUs { get; set; }
        public string UnitsUkUa { get; set; }
        public string UnitsBgBg { get; set; }
        public string UnitEn { get; set; }
        public string DefaultYMin { get; set; }
        public string DefaultYMax { get; set; }
        public string DefaultBackgroundColor { get; set; }
        public string DefaultBackgroundImage { get; set; }
        public string DefaultAreaFillOpacity { get; set; }
        public string DefaultStroke { get; set; }

        public MetricType Type { get; set; }

        public Guid? EncyclopediaId { get; set; }
    }
}
