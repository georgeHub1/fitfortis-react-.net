using Backend.Utility;

namespace Backend.ModelService
{
    public class CustomEmailData : BaseEmailData
    {
        public CustomEmailData() : base(EmailType.CustomEmail)
        {
        }

        public string Subject { get; set; }
        public string Body { get; set; }
    }
}
