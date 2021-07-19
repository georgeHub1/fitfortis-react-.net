using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class NewsDetails : BaseEntity
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime Date { get; set; }
        public Guid? PictureId { get; set; }
        public string PictureUrl { get; set; }
        public int Likes { get; set; }
        public string ShareLink { get; set; }
        public bool IsLiked { get; set; }
        public string Language { get; set; }
        public string MetaTags { get; set; }
    }
}
