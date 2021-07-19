using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class SearchTerms : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }

        public string LanguageCode { get; set; }
    }
}