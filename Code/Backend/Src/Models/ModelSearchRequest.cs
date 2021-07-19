using System;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelSearchRequest : BaseEntityModel<Guid>
    {
        [Required]
        public string SearchText { get; set; }
        public DateTime Date { get; set; }
        public SearchArea SearchArea { get; set; }
        public Guid? LinkedEntityId { get; set; }
        public Guid? UserId { get; set; }
        public bool? IsSuccessful { get; set; }
    }
}
