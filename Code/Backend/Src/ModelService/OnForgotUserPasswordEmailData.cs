using Backend.Utility;

namespace Backend.ModelService
{
    public class OnForgotUserPasswordEmailData : BaseEmailData
    {
        public OnForgotUserPasswordEmailData() : base(EmailType.OnForgotUserPassword)
        {

        }

        public string UsernameTo { get; set; }
        public string ResetPasswordUrl { get; set; }
        public string Email { get; set; }
    }
}