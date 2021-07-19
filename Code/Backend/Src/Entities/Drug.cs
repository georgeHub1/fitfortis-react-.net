using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class Drug : BaseEntity<Guid>
    {
        public string TitleEn { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }
        public string OriginalEntryId { get; set; }
        public string BodySystemId { get; set; }

        [NotMapped]
        public string Title { get; set; }
        [NotMapped]
        public string Description { get; set; }
    }
}
