using Backend.Entities;

namespace Backend.Models
{
    public class ModelUpdateChartMetric : BaseEntityModel
    {
        public bool? ShowGoalLines { get; set; }
        public bool? AnnotateLastEntry { get; set; }
        public bool? AnnotateMaxEntry { get; set; }
        public bool? AnnotateMinEntry { get; set; }
        public string BackgroundColor { get; set; }
        public string Stroke { get; set; }

        public float? Goal { get; set; }
        public float? GoalMin { get; set; }
        public float? GoalMax { get; set; }
        public string YMin { get; set; }
        public string YMax { get; set; }
    }
}
