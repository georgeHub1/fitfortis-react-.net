using System;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelDocument : BaseEntityModel<Guid>
    {
        public string FileUri { get; set; }
        public string OriginalFileName { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string ContentType { get; set; }
        public string FileSize { get; set; }
        public DateTime Date { get; set; }
        public Guid FieldId { get; set; }
        [JsonConverter(typeof(StringEnumConverter))]
        public DocumentType Type { get; set; }
        public Guid? UserId { get; set; }
    }
}
