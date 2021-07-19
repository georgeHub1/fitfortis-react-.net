namespace Backend.Models
{
  public class MetricInfo
  {
      // Basics
      public string Name { get; set; }
      public string Code { get; set; }
      public string Description { get; set; }
      public string Units { get; set; }
      public string YMin { get; set; }
      public string YMax { get; set; }


      // Default look
      public string Stroke { get; set; }
      public float AreaFillOpacity { get; set; }
      public string BackgroundColor { get; set; }
      public string BackgroundImage { get; set; }
  }
}
