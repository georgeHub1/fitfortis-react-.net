using System;
using Backend.Entities;


namespace Backend.ModelService
{
    public class XxmImportModel : BaseEntity
    {
        public string Title { get; set; }
        public string Synonyms { get; set; }
        public string ConciseDescription { get; set; }
        public string OrganSystem { get; set; }
    }
}
