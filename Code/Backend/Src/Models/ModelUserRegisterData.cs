using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUserRegisterData : BaseEntityModel
    {
        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [Required]
        [MaxLength(50)]
        public string Password { get; set; }

        [Required]
        [MaxLength(128)]
        public string FirstName { get; set; }

        [Required]
        [MaxLength(128)]
        public string LastName { get; set; }
        [Required]
        public string Language { get; set; }
    }
}
