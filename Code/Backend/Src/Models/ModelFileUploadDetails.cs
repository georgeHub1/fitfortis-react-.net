using System;
using System.IO;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelFileUploadDetails : BaseEntityModel
    {
        public string FileUrl { get; set; }
        public Guid Id { get; set; }
        public string FileName { get; set; }
        public Guid? UserId { get; set; }
        public string ContentType { get; set; }
        public long? ContentLength { get; set; }
        public DateTimeOffset? SavedAt { get; set; }
        public MemoryStream Stream { get; set; }
    }
}