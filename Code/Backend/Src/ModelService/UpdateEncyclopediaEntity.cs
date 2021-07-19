using Backend.Entities;

namespace Backend.ModelService
{
    public class UpdateEncyclopediaEntity : BaseEntity
    {
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string TitleEn { get; set; }

        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }
        public string DescriptionEn { get; set; }
    }
}
