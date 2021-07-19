using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class AnalyticUserSignIn : BaseEntity<Guid>
    {
        public DateTime? SignInDatetime { get; set; }
        public int SessionDurationInSeconds { get; set; }
        public LoginStatus Status { get; set; }
        public string UserAgent { get; set; }
        public Guid? AnonymousId { get; set; }

        public Guid? UserId { get; set; }

        public virtual User User { get; set; }
        
    }
}
