using System.Collections.Generic;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.Models
{
    public class ModelUpsertMetricData : BaseEntityModel
    {
        public ModelShortMetricData[] MetricData { get; set; }
    }
}
