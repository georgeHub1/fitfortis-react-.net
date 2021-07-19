using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelDrug : BaseEntityModel<Guid>
    {
        public string TitleEn { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string DescriptionEn { get; set; }
        public string DescriptionEnUs { get; set; }
        public string DescriptionUkUa { get; set; }
        public string DescriptionBgBg { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
    }
}
