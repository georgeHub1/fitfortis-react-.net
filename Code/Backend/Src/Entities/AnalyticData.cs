using System;

namespace Backend.Entities
{
    public class AnalyticData : BaseEntity<Guid>
    {
        public DateTime Date { get; set; }
        public  Guid AnalyticId { get; set; }
        public string Value { get; set; }

        public virtual Analytic Analytic { get; set; }

    }
}
