using Backend.Entities;

namespace Backend.ModelService
{
    public class ForgotUserPassword : BaseEntity
    {
        public string Email { get; set; }
        public string LanguageCode { get; set; }
    }
}
