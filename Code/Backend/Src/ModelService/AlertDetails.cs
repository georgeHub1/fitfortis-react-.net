using System;
using Backend.Entities;

namespace Backend.ModelService
{
    public class AlertDetails : BaseEntity
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
    }
}
