using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class ShortUser : BaseEntity
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public  string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string LanguageCode { get; set; }
        public Guid? AvatarId { get; set; }
        public Guid UserId { get; set; }
        public SexAtBirthType? SexAtBirth { get; set; }
        public string Role { get; set; }
    }
}
