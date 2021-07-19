using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class Document : BaseEntity<Guid>
    {
        public string FileUri { get; set; }
        public string OriginalFileName { get; set; }
        public string FileName { get; set; }
        public string Description { get; set; }
        public string ContentType { get; set; }
        public string FileSize { get; set; }
        public DateTime Date { get; set; }
        public Guid FieldId { get; set; }
        public DocumentType Type { get; set; }
        public Guid? UserId { get; set; }

        public virtual User User { get; set; }
    }
}
