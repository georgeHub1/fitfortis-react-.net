using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IGenericRepository<TEntity, TEntityIdType> where TEntity : IBaseEntity<TEntityIdType>, IIdentifiable<TEntityIdType>, IInactivebleAt
    {
        IQueryable<TEntity> SelectAll(bool isTrackable = false);
        TEntity SelectById(TEntityIdType id, bool throwNotFound = true);
        TEntity Create(TEntity data);
        int Create(List<TEntity> entities);
        TEntity Update(TEntity data);
        TEntity Replace(TEntity oldData, TEntity data);
        TEntity Delete(TEntityIdType id, bool throwNotFound = true);
        IQueryable<TEntity> SelectAllByIds(IEnumerable<TEntityIdType> ids, bool isTrackable = false);
        IQueryable<TEntity> SelectAllByIdsSql(TEntityIdType[] ids);
        void Save();

    }
}
