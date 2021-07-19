using System;
using System.Collections.Generic;

namespace Backend.Entities
{
    public class News : BaseEntity<Guid>
    {
        public string TitleEn { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }
        public Guid? PictureId { get; set; }
        public DateTime Date { get; set; }
        public string PictureUrl { get; set; }
        public string Language { get; set; }

        public virtual ICollection<NewsLikesAndComments> LikesAndComments { get; set; }
    }
}
