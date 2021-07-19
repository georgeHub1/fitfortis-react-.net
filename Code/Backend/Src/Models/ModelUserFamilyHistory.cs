using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserFamilyHistory : BaseEntityModel<Guid>
    {
        public Guid UserId { get; set; }
        public Guid FamilyHistoryId { get; set; }
        public DateTime? Date { get; set; }
    }
}