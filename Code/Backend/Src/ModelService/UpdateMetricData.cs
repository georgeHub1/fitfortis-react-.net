using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UpdateMetricData : BaseEntity
    {
        public DateTime? Date { get; set; }
        public float? Value { get; set; }
        public float? RangeMin { get; set; }
        public float? RangeMax { get; set; }
        public float? Measurements { get; set; }
        public float? DoctorVisits { get; set; }
        public float? LabResults { get; set; }
        public string DoctorVisitComments { get; set; }
        public string LabResultsComments { get; set; }
        public string Comment { get; set; }
    }
}
