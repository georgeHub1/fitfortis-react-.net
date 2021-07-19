using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    
    public class ModelMetricDataQueryParams : BaseEntityModel
    {
        [AttributeBindingMember("dateFrom")]
        public DateTime? DateFrom { get; set; }
        [AttributeBindingMember("dateTo")]
        public DateTime? DateTo { get; set; }

        [AttributeBindingMember("userId")]
        public Guid? UserId { get; set; }
    }
}
