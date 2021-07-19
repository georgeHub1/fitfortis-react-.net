using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public interface IBaseEntity
    {

    }

    public interface IBaseEntity<TEntity> : IBaseEntity
    {

    }

    public abstract class BaseEntity : IBaseEntity
    {

    }

    public class EmptyEntity : BaseEntity
    {
    }

    public abstract class BaseEntity<T> : BaseEntity, IBaseEntity<T>, IIdentifiable<T>, IInactivebleAt
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual T Id { get; set; }

        [Column(TypeName = "datetime2", Order = 101)]
        public DateTime? InactiveAt { get; set; }

        //public bool IsDeleted { get; set; }
        //public int TenantId { get; set; }
    }
}
