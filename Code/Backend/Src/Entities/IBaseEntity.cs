using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Entities
{
    public interface IIdentifiable<T> //where T : struct 
    {
        [Key]
        T Id { get; set; }
    }

    public interface ISaveTrackable
    {
        Guid CreatedBy { get; set; }
        DateTime CreatedOn { get; set; }

        Guid ModifiedBy { get; set; }
        DateTime ModifiedOn { get; set; }
    }

    public interface IInactivebleAt
    {
        DateTime? InactiveAt { get; set; }
    }
}
