using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class EnumValuesResult : BaseEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsSelected { get; set; }
        public float HelthIndexAmount { get; set; }
    }
}
