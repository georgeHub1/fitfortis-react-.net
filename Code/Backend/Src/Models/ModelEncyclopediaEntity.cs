using System;
using System.Collections.Generic;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelEncyclopediaEntity : BaseEntityModel<Guid>
    {
        public string OriginalEntryId { get; set; }
        public string BodySystemId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public List<string> Synonyms { get; set; }
        public List<string> Symptoms { get; set; }
        public string MetaTags { get; set; }
    }
}
