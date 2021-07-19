using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelChartMetricDetails : BaseEntityModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ModelChartMetric ChartMetric { get; set; }
        public ModelMetric DefaultMetric { get; set; }
        public List<ModelMetricData> MetricData { get; set; }
    }
}
