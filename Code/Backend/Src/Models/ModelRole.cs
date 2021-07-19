using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelRole : BaseEntityModel<Guid>
    {
        public string Name { get; set; }
        public string NormalizedName { get; set; }
    }
}
