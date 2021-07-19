using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelUpdateEncyclopedia : BaseEntityModel
    {
        public string Title { get; set; }
        public string Synonyms { get; set; }
        public string ConciseDescription { get; set; }
        public string ExtendedDescription { get; set; }
        public string Tag { get; set; }
        public string OrganSystem { get; set; }
        public string Visuals { get; set; }
        public string LanguageCode { get; set; }
        public Guid? OriginalId { get; set; }
    }
}