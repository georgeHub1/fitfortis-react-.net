using Backend.Entities;
using System;
using System.Collections.Generic;

namespace Backend.ModelService
{
    public class DeleteMetricDataBulk : BaseEntity
    {
        public List<Guid> MetricDataIds { get; set; }
        public Guid UserId { get; set; }
    }
}
