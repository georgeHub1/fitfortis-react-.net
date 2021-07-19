using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelForgotUserPassword : BaseEntityModel
    {
        [Required]
        public string Email { get; set; }
        public string LanguageCode { get; set; }
    }
}
