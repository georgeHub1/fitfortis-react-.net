using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UserRegisterConfirmData : BaseEntity
    {
        public Guid UserId { get; set; }
        public string EmailConfirmationToken { get; set; }
    }
}