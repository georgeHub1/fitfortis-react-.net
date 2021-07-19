using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelSearchTerms : BaseEntityModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public string LanguageCode { get; set; }
    }
}