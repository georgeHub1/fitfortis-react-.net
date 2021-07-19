using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class CreateLike : BaseEntity
    {
        public Guid NewsId { get; set; }
        public Guid UserId { get; set; }
    }
}
