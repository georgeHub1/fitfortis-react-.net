using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelAnalyticUserSignIn : BaseEntityModel<Guid>
    {
        public DateTime? SignInDatetime { get; set; }
        public int SessionDurationInSeconds { get; set; }
        public LoginStatus Status { get; set; }
        public string UserAgent { get; set; }
        public Guid? AnonymousId { get; set; }

        public Guid? UserId { get; set; }
    }
}
