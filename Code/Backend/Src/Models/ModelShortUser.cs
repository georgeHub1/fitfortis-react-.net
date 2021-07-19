using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelShortUser : BaseEntityModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string LanguageCode { get; set; }
        public Guid? AvatarId { get; set; }
        public Guid UserId { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public SexAtBirthType? SexAtBirth { get; set; }
        public string Role { get; set; }

    }
}
