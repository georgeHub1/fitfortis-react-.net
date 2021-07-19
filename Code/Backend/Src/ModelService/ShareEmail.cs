using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ShareEmail : BaseEntity
    {
        public Guid UserIdFrom { get; set; }
        public string EmailTo { get; set; }
        public Guid NewsId { get; set; }
        public string EmailBody { get; set; }
    }
}
