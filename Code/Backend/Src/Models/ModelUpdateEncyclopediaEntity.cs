using Backend.Entities;

namespace Backend.Models
{
    public class ModelUpdateEncyclopediaEntity : BaseEntityModel
    {
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }

        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }
    }
}