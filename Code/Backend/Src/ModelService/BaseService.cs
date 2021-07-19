using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.Extensions;

namespace Backend.ModelService
{
    public abstract class BaseService
    {

        protected async Task<TResult> ExecuteAsync<TResult>(Func<TResult> executor)
        {
            return await Task.Run(() => executor());
        }

        protected async Task ExecuteAsync(Action executor)
        {
            await Task.Run(() => executor());
        }

        protected async Task<ServiceResponse<T>> GetResponse<T>(IQueryable<T> data, Paging paging, Sorting sorting) where T : BaseEntity
        {
            var total = data.Count();
            data = data.Select(paging, sorting);
            return new ServiceResponse<T>(await ExecuteAsync(() => data.ToList()), total);
        }
    }
}
