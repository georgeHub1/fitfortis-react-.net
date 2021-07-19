using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserVaccineTherapy : BaseEntityModel<Guid>
    {
        public Guid UserId { get; set; }
        public Guid VaccineTherapyId { get; set; }
        public DateTime Date { get; set; }
    }
}
