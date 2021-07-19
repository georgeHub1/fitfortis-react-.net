using System;
using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelProfileCommonResult : BaseEntityModel
    {
        public Guid? Id { get; set; }
        public string Category { get; set; }
        public string Key { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid EncyclopediaId { get; set; }
        public bool? IsSelected { get; set; }
        public bool? IsRecommended { get; set; }
        public float? HealthIndexAmount { get; set; }
        public List<ModelEnamValuesResult> Values { get; set; }
    }
}
