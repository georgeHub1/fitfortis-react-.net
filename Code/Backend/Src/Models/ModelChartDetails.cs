using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelChartDetails : BaseEntityModel
    {
        public ModelChart Chart { get; set; }
        public List<ModelChartMetricDetails> ChartMetricDetails { get; set; }
    }
}