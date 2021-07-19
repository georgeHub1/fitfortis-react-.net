using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class MetricDataQueryParams : BaseEntity
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public Guid? UserId { get; set; }
    }
}
