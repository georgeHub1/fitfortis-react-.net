using System;
using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelSymptomDetails : BaseEntityModel
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public bool ApplicableToMale { get; set; }
        public bool ApplicableToFemale { get; set; }
        public bool ApplicableToFemalePregnant { get; set; }
        public int MinAgeOfApplicability { get; set; }
        public int MaxAgeOfApplicability { get; set; }

        public List<string> Symptoms { get; set; }
    }
}