using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class VaccineTherapy : BaseEntity<Guid>
    {
        public VaccineCategory Category { get; set; }
        public bool Recomended { get; set; }

        public Guid EncyclopediaId { get; set; }
        public float HealthIndexAmount { get; set; }

        public virtual EncyclopediaEntity Encyclopedia { get; set; }
    }
}
