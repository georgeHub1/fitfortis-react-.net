using System;
using System.Collections.Generic;

namespace Backend.Entities
{
    public class Analytic : BaseEntity<Guid>
    {
        public string CategoryBgBg { get; set; }
        public string NameBgBg { get; set; }
        public string CategoryEnUs { get; set; }
        public string NameEnUs { get; set; }
        public string CategoryUkUa { get; set; }
        public string NameUkUa { get; set; }
        public string NameEn { get; set; }
        public string CategoryEn { get; set; }
        public string SqlQuery { get; set; }

        public virtual ICollection<AnalyticData> AnalyticData { get; set; }
    }
}
