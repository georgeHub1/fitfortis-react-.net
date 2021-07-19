using System;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelAlertDetails : BaseEntityModel
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; }
    }
}
