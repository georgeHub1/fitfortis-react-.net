using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class UpdateDocument : BaseEntity
    {
        public string FileName { get; set; }
        public string Description { get; set; }
        public DocumentType Type { get; set; }
        public DateTime? Date { get; set; }
    }
}