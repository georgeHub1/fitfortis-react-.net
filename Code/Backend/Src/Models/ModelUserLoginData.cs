using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserLoginData : BaseEntityModel
    {
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [Required]
        [MaxLength(50)]
        public string Password { get; set; }
    }
}
