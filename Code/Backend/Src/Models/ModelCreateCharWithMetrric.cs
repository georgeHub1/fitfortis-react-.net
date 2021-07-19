using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelCreateCharWithMetrric : BaseEntityModel
    {
        public string Name { get; set; }
        public Guid MetricId { get; set; }
        public Guid UserId { get; set; }
        public Guid[] MetricIds { get; set; }
    }
}
