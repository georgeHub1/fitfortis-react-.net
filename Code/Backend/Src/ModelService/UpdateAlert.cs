using System;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class UpdateAlert : BaseEntity
    {
        public string MessageEnUs { get; set; }
        public string MessageUkUa { get; set; }
        public string MessageBgBg { get; set; }
        public DateTime ExecutionDate { get; set; }
        public AlertType? Type { get; set; }
    }
}
