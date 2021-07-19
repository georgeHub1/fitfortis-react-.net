using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelUpdateDocument : BaseEntityModel
    {
        public string FileName { get; set; }
        public string Description { get; set; }
        public DocumentType Type { get; set; }
        public DateTime? Date { get; set; }
    }
}