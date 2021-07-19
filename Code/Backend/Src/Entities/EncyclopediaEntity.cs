using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class EncyclopediaEntity : BaseEntity<Guid>
    {
        public string OriginalEntryId { get; set; }
        public string BodySystemId { get; set; }
        public string TitleEn { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }

        [NotMapped]
        public string Title { get; set; }
        [NotMapped]
        public string Description { get; set; }
        [NotMapped]
        public string MetaTags { get; set; }
        [NotMapped]
        public List<string> Synonyms { get; set; }
        [NotMapped]
        public List<string> Symptoms { get; set; }


    }
}
