using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ShortMetricData : BaseEntity
    {
        public DateTime Date { get; set; }
        public float? Value { get; set; }
        public Guid MetricId { get; set; }
        public Guid? Id { get; set; }
        public string Comment { get; set; }
    }
}
