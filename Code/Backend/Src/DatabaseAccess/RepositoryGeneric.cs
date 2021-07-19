using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Backend.Entities;
using Backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryGeneric<TEntity, TEntityIdType> : IGenericRepository<TEntity, TEntityIdType>
        where TEntity : class, IBaseEntity<TEntityIdType>, IIdentifiable<TEntityIdType>, IInactivebleAt
    {
        private const bool ThrowNotFoundException = false;
        private readonly DbSet<TEntity> _table;

        protected RepositoryGeneric(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
            _table = UnitOfWork.Set<TEntity>();
        }

        protected IQueryable<TEntity> Table => _table.AsNoTracking().Where(x => x.InactiveAt == null).AsQueryable();
        protected IQueryable<TEntity> TableTracking => _table.Where(x => x.InactiveAt == null).AsQueryable();
        protected IUnitOfWork UnitOfWork { get; }

        public IQueryable<TEntity> SelectAll(bool isTrackable = false)
        {
            return isTrackable ? TableTracking : Table;
        }

        public TEntity SelectById(TEntityIdType id, bool throwNotFound = ThrowNotFoundException)
        {
            var entity = _table.Find(id);

            if (entity?.InactiveAt != null)
                entity = null;

            if (entity == null && throwNotFound)
                EntityNotFoundException.ThrowMe(typeof(TEntity).Name, nameof(IIdentifiable<TEntityIdType>.Id), id.ToString());

            return entity;
        }

        public TEntity Create(TEntity data)
        {
            var entity = _table.Add(data);
            return entity.Entity;
        }

        public TEntity Update(TEntity data)
        {
            var entity = _table.Attach(data);
            UnitOfWork.Entry(data).State = EntityState.Modified;
            return entity.Entity;
        }


        public TEntity Replace(TEntity entityToReplace, TEntity entity)
        {
            if (entity != null && entityToReplace != null)
            {
                entity.Id = entityToReplace.Id;
                entityToReplace = _table.Attach(entityToReplace).Entity;
                UnitOfWork.Entry(entityToReplace).CurrentValues.SetValues(entity);

                return entityToReplace;
            }

            return null;
        }

        public TEntity Delete(TEntityIdType id, bool throwNotFound = ThrowNotFoundException)
        {
            var entity = _table.Find(id);

            if (entity == null && throwNotFound)
                EntityNotFoundException.ThrowMe(nameof(TEntity), nameof(IIdentifiable<TEntityIdType>.Id), id.ToString());

            _table.Remove(entity);

            return entity;
        }

        public IQueryable<TEntity> SelectAllByIds(IEnumerable<TEntityIdType> ids, bool isTrackable = false)
        {
            var entities =
                (isTrackable ? TableTracking : Table).Where(it => it.InactiveAt == null && ids.Contains(it.Id));
            return entities;
        }

        public IQueryable<TEntity> SelectAllByIdsSql(TEntityIdType[] ids)
        {
            var stringIds = new StringBuilder();
            stringIds.AppendFormat("'{0}'", ids[0]);

            foreach (var id in ids)
            {
                stringIds.AppendFormat(", '{0}'", id);
            }

            var tableName = typeof(TEntity).Name;

            var sql = $"Select * from {tableName} WHERE [ID] IN ({stringIds})";

           return UnitOfWork.Set<TEntity>().FromSql(sql).AsNoTracking();
        }

        public int Create(List<TEntity> entities)
        {
            try
            {
                _table.AddRange(entities);
                return 0;
            }
            catch (Exception)
            {
                return 1;
            }
            
        }

        public void Save()
        {
            UnitOfWork.SaveChanges();
        }

        protected IQueryable<TTable> GetDbTable<TTable>() where TTable : class, IInactivebleAt
            => UnitOfWork.Set<TTable>().AsNoTracking().AsQueryable();
    }
}
