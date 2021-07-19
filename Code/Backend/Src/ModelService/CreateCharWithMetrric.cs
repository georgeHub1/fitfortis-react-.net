using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class CreateCharWithMetrric : BaseEntity
    {
        public string Name { get; set; }
        public Guid MetricId { get; set; }
        public Guid UserId { get; set; }
        public Guid[] MetricIds { get; set; }
    }
}
