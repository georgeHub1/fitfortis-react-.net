using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserCondition : BaseEntityModel<Guid>
    {
        public Guid UserId { get; set; }
        public Guid ChronicConditionId { get; set; }
    }
}