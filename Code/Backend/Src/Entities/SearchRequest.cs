using System;
using Backend.Utility;

namespace Backend.Entities
{
    public class SearchRequest : BaseEntity<Guid>
    {
        public string SearchText { get; set; }
        public DateTime Date { get; set; }
        public SearchArea SearchArea { get; set; }
        public Guid? UserId { get; set; }
        public Guid? LinkedEntityId { get; set; }
        public bool? IsSuccessful { get; set; }


        public virtual User User { get; set; }
    }
}
