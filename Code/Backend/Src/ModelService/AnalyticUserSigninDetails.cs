using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class AnalyticUserSigninDetails : BaseEntity
    {
        public DateTime? SignInDatetime { get; set; }
        public int SessionDurationInSeconds { get; set; }
        public LoginStatus Status { get; set; }
        public string Os { get; set; }
        public string Browser { get; set; }
        public string Device { get; set; }

        public string RequestUa { get; set; }

        public Guid? AnonymousId { get; set; }

        public Guid? UserId { get; set; }
    }
}
