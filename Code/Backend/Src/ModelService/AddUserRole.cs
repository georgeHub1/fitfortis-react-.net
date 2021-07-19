using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class AddUserRole : BaseEntity
    {
        public Guid UserId { get; set; }
        public string Role { get; set; }
    }
}
