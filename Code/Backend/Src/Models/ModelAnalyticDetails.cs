using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAnalyticDetails : BaseEntityModel
    {
        public ModelShortAnalytic Analytic { get; set; }
        public List<ModelAnalyticData> AnalyticData { get; set; }
    }
}
