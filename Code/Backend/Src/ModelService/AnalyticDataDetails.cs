using Backend.Entities;

namespace Backend.ModelService
{
    public class AnalyticDataDetails : BaseEntity
    {
        public string Name { get; set; }
        public string Category { get; set; }
        public AnalyticData AnalyticData { get; set; }
    }
}
