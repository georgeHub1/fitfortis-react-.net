using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UserLoginData : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }
    }
}