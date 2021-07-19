using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class GetNewsQueryParams : BaseEntity
    {
        public Guid? UserId { get; set; }
        public string Link { get; set; }
    }
}
