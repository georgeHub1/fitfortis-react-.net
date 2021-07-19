using System.Collections.Generic;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ChartDetails : BaseEntity
    {
        public FitFortisChart Chart { get; set; }
        public List<ChartMetricDetails> ChartMetricDetails { get; set; }
    }
}
