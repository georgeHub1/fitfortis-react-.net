using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class EncyclopediaShortInfo : BaseEntity
    {
        public Guid? Id { get; set; }
        public string Title { get; set; }
        public string ShortDescription { get; set; }        
    }
}
