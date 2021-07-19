using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class ServiceRequest<TEntity> : IServiceRequest where TEntity : IBaseEntity
    {
        public TEntity Data { get; set; }
        public Paging Paging { get; set; }
        public Sorting Sorting { get; set; }
        public User User { get; set; }
        public ApiOperationType Operation { get; set; }
    }

    public interface IServiceRequest
    {
        Paging Paging { get; set; }
        Sorting Sorting { get; set; }
        User User { get; set; }
        ApiOperationType Operation { get; set; }
    }

    public class Paging
    {
        public int StartItem { get; set; }
        public int MaxItems { get; set; }
    }

    public class Sorting
    {
        public bool Asc { get; set; }
        public string Field { get; set; }
    }
}
