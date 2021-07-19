namespace Backend.Models
{
  public class MetricDataPoint
  {
    public long DateTime { get; set; }
    public float? Value { get; set; }
    public float? Goal { get; set; }
    public float? RangeMin { get; set; }
    public float? RangeMax { get; set; }
    public float? Measurements { get; set; }
    public float? DoctorVisits { get; set; }
    public float? LabResults { get; set; }
    public double? Weight { get; set; }
    public float? Glu { get; set; }
  }
}
