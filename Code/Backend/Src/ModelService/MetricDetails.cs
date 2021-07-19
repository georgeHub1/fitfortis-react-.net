using Backend.Entities;

namespace Backend.ModelService
{
    public class MetricDetails : BaseEntity
    {
        public Metric Metric { get; set; }
        public EncyclopediaShortInfo EncyclopediaShortInfo { get; set; }
    }
}