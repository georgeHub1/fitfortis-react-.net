using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAnalytic : BaseEntityModel<Guid>
    {
        public string CategoryBgBg { get; set; }
        public string NameBbBg { get; set; }
        public string CategoryEnUs { get; set; }
        public string NameEnUs { get; set; }
        public string CategoryUkUa { get; set; }
        public string NameUkUa { get; set; }
        public string NameEn { get; set; }
        public string CategoryEn { get; set; }
        public string SqlQuery { get; set; }
    }
}
