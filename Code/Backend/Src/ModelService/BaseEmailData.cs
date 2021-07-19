using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class BaseEmailData : BaseEntity
    {
        public BaseEmailData(EmailType emailType)
        {
            EmailType = emailType;
        }

        public EmailType EmailType { get; set; }
    }
}
