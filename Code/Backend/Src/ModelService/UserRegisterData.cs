using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UserRegisterData : BaseEntity
    {
        [StringLength(50)]
        public string Email { get; set; }
     
        [StringLength(50)]
        public string Password { get; set; }

        [Required]
        [StringLength(128)]
        public string FirstName { get; set; }

        [Required]
        [StringLength(128)]
        public string LastName { get; set; }
        public string Language { get; set; }
    }
}
