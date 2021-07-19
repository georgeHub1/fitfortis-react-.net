using System;
using System.Collections.Generic;

namespace Backend.Entities
{
    public class FitFortisChart : BaseEntity<Guid>
    {
        public string Name { get; set; }
        public Guid UserId { get; set; }


        public virtual User User { get; set; }

        public virtual ICollection<ChartMetric> ChartMetrics { get; set; }
    }
}
