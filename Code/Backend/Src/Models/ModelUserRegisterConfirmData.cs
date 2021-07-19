using System;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserRegisterConfirmData : BaseEntityModel
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string EmailConfirmationToken { get; set; }
    }
}
