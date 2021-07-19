using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.ModelService
{
    public class ServiceResponse<TEntity> where TEntity : IBaseEntity
    {
        public TEntity Item { get; set; }
        public List<TEntity> Items { get; set; }
        public int? Total { get; set; }
        public List<ValidationError> Errors { get; set; }
        public bool Success => Errors == null || !Errors.Any();

        public ServiceResponse()
        {
        }

        public ServiceResponse(TEntity item)
        {
            Item = item;
            Items = null;
            Total = null;
        }

        public ServiceResponse(List<TEntity> items, int? total)
        {
            Item = default(TEntity);
            Items = items;
            Total = total;
        }
    }
}
