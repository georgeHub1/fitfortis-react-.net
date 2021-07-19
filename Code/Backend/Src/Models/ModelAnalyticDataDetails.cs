using Backend.Entities;

namespace Backend.Models
{
    public class ModelAnalyticDataDetails : BaseEntityModel
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public ModelAnalyticData AnalyticData { get; set; }
    }
}
