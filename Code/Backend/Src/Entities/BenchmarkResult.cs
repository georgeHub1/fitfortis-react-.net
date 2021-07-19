using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class BenchmarkResult : BaseEntity<Guid>
    {
        public string Method { get; set; }

        public double Mean { get; set; }
        public double StdError { get; set; }
        public double StdDev { get; set; }
        public double Min { get; set; }
        public double Q1 { get; set; }
        public double Median { get; set; }
        public double Q3 { get; set; }
        public double Max { get; set; }
        public DateTime Date { get; set; }
        public string Location { get; set; }
    }
}
