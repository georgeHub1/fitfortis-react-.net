using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelEncyclopediaShortInfo : BaseEntityModel
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string TitleEnUs { get; set; }
        public string TitleUkUa { get; set; }
        public string TitleBgBg { get; set; }
        public string ShortDescription { get; set; }
        public string ShortDescriptionEnUs { get; set; }
        public string ShortDescriptionUkUa { get; set; }
        public string ShortDescriptionBgBg { get; set; }
    }
}
