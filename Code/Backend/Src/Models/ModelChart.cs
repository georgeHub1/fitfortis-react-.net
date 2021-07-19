using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Backend.Entities;

namespace Backend.Models
{
    public class ModelChart : BaseEntityModel<Guid>
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid UserId { get; set; }

    }
}