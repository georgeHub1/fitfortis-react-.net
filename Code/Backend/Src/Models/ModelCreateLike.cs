using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelCreateLike : BaseEntityModel
    {
        public Guid NewsId { get; set; }
        public Guid UserId { get; set; }
    }
}
