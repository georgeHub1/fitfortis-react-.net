using System.Collections.Generic;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UpsertMetricData : BaseEntity
    {
        public ShortMetricData[] MetricData { get; set; }
    }
}
