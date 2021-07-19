using System;

namespace Backend.Entities
{
    public class UserVaccineTherapy : BaseEntity<Guid>
    {
        public Guid UserId { get; set; }
        public Guid VaccineTherapyId { get; set; }
        public DateTime Date { get; set; }

        public virtual User User { get; set; }
        public virtual VaccineTherapy VaccineTherapy { get; set; }
    }
}
