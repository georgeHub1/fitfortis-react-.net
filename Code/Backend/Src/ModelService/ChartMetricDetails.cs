using System.Collections.Generic;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ChartMetricDetails : BaseEntity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ChartMetric ChartMetric { get; set; }
        public Metric DefaultMetric { get; set; }
        public List<MetricData> MetricData { get; set; }
    }
}
