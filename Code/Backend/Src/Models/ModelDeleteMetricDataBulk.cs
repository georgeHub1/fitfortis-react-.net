using Backend.Entities;
using System;
using System.Collections.Generic;

namespace Backend.Models
{
    public class ModelDeleteMetricDataBulk : BaseEntityModel
    {
        public List<Guid> MetricDataIds { get; set; }
        public Guid UserId { get; set; }        
    }
}
