using Backend.Utility;

namespace Backend.ModelService
{
    public class OnRegistrationConfirmationEmailData : BaseEmailData
    {
        public OnRegistrationConfirmationEmailData() : base(EmailType.OnRegistrationConfirmation)
        {
        }

        public string UsernameTo { get; set; }
        public string UrlConfirm { get; set; }
        

    }
}