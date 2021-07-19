using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.Models
{
    public class ModelGetNewsQueryParams : BaseEntityModel
    {
        [AttributeBindingMember("userId")]
        public Guid? UserId { get; set; }
        [AttributeBindingMember("link")]
        public string Link { get; set; }
    }
}
