using System.Collections.Generic;
using Backend.Entities;

namespace Backend.ModelService
{
    public class AnalyticDetails : BaseEntity
    {
        public ShortAnalytic Analytic { get; set; }
        public List<AnalyticData> AnalyticData { get; set; }
    }
}
