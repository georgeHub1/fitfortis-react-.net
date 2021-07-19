using Backend.Entities;

namespace Backend.Models
{
    public class ModelSendgridResponse : BaseEntityModel
    {
        public string Email { get; set; }
        public string Timestamp { get; set; }
        public string Event { get; set; }
        public string Category { get; set; }
        public string Response { get; set; }
        public string Attempt { get; set; }
        public string Ip { get; set; }
        public string Useragent { get; set; }
    }
}
