using System;
using Backend.Entities;
using Backend.Utility;
using Microsoft.AspNetCore.Http;

namespace Backend.Models
{
    public class ModelUploadFile : BaseEntityModel
    {
        public DocumentType Type { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public string FileSize { get; set; }
        public IFormFile File { get; set; }
        
    }
}
