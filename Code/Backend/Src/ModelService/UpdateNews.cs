using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class UpdateNews : BaseEntity
    {
        public string TitleEn { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }
        public string DescriptionEn { get; set; }
        public DateTime? Date { get; set; }
        public string PictureUrl { get; set; }
        public Guid? PictureId { get; set; }
        public string Language { get; set; }
    }
}
