using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAnalyticData : BaseEntityModel<Guid>
    {
        public DateTime Date { get; set; }
        public Guid AnalyticId { get; set; }
        public string Value { get; set; }
    }
}
