using Backend.Entities;
using Backend.ModelService;

namespace Backend.Models
{
    public class ModelMetricDetails : BaseEntityModel
    {
        public ModelMetric Metric { get; set; }
        public ModelEncyclopediaShortInfo EncyclopediaShortInfo { get; set; }
    }
}