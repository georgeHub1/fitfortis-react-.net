using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAddUserRole : BaseEntityModel
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
    }
}
