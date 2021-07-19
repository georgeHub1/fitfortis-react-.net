using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelShareEmail : BaseEntityModel
    {
        public Guid? UserIdFrom { get; set; }
        public string EmailTo { get; set; }
        public Guid NewsId { get; set; }
        public string EmailBody { get; set; }
    }
}
