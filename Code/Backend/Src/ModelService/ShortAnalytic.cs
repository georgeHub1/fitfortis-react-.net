using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ShortAnalytic : BaseEntity
    {
        public Guid Id { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string SqlQuery { get; set; }
    }
}
