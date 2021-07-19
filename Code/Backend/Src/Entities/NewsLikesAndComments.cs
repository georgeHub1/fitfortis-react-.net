using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class NewsLikesAndComments : BaseEntity<Guid>
    {
        public string Comment { get; set; }
        public DateTime Date { get; set; }
        public NewsRecordType Type { get; set; }

        public Guid UserId { get; set; }
        public Guid NewsId { get; set; }

        public virtual User User { get; set; }
        public virtual News News { get; set; }

    }
}
