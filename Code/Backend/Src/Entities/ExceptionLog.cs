using System;

namespace Backend.Entities
{
    public class ExceptionLog : BaseEntity<Guid>
    {
        public string Message { get; set; }
        public string Type { get; set; }
        public string Url { get; set; }
        public string Source { get; set; }
        public DateTime Date { get; set; }
        public string Username { get; set; }
        public Guid? UserId { get; set; }

        public virtual User User { get; set; }
    }
}