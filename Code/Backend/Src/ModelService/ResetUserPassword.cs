using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ResetUserPassword : BaseEntity
    {
        public Guid UserId { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
    }
}