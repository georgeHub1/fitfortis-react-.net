using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelResetUserPassword : BaseEntityModel
    {
        public Guid UserId { get; set; }
        public string NewPassword { get; set; }
        public string Token { get; set; }
    }
}