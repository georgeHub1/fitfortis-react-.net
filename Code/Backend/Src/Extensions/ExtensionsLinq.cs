using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Backend.Configuration;
using Backend.Entities;
using Backend.Exceptions;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.Extensions
{
    public static class ExtensionsLinq
    {
        private static readonly IList<Type> IdentifiableTypes = new List<Type> { typeof(IIdentifiable<int>), typeof(IIdentifiable<string>), typeof(IIdentifiable<Guid>) };

        private static readonly IList<Type> IdTypes = new List<Type> { typeof(int), typeof(string), typeof(Guid) };

        public static IQueryable<T> OrderByField<T>(this IQueryable<T> q, string sortField, bool ascending)
        {
            var property = typeof(T).GetProperty(sortField, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
            if (property == null)
                throw new ValidationException(new ValidationError(OperationErrorType.WrongSortedFieldName, sortField));

            var param = Expression.Parameter(typeof(T), "p");
            var prop = Expression.Property(param, sortField);
            var exp = Expression.Lambda(prop, param);
            var method = ascending ? "OrderBy" : "OrderByDescending";
            Type[] types = { q.ElementType, exp.Body.Type };
            var mce = Expression.Call(typeof(Queryable), method, types, q.Expression, exp);
            return q.Provider.CreateQuery<T>(mce);
        }

        public static IQueryable<T> Select<T>(this IQueryable<T> source, Paging paging = null, Sorting sorting = null, int maxBatchSize = Constants.MaxBatchSize)
        {
            var result = source;

            if (sorting != null)
            {
                result = result.Sort(sorting.Field, sorting.Asc);
            }

            if (paging != null && paging.MaxItems >= 0 && paging.StartItem > 0)
            {
                if (paging.MaxItems > Constants.MaxBatchSize)
                {
                    paging.MaxItems = Constants.MaxBatchSize;
                }
                if (sorting == null)
                    result = result.Sort(string.Empty, true);

                result = result.SelectItems(paging.StartItem, paging.MaxItems);
            }
            else
            {
                result = result.Take(maxBatchSize);
            }

            return result;
        }

        public static IQueryable<T> SelectPage<T>(this IQueryable<T> source, int page, int size)
        {
            var startFrom = (page - 1) * size;
            var result = source.Skip(startFrom).Take(size);
            return result;
        }

        public static IQueryable<T> SelectItems<T>(this IQueryable<T> source, int startIndex, int maxItems)
        {
            var startFrom = startIndex - 1;
            var result = source.Skip(startFrom).Take(maxItems);
            return result;
        }

        public static IQueryable<T> Sort<T>(this IQueryable<T> source, string field, bool isAsc)
        {
            IQueryable<T> result = null;

            if (string.IsNullOrEmpty(field))
            {
                var propName = GetSortedPropertyName<T>();

                if (string.IsNullOrEmpty(propName))
                {
                    result = isAsc ? source.OrderBy(s => s) : source.OrderByDescending(s => s);
                }
                else
                {
                    result = source.OrderByField(propName, isAsc);
                }
            }
            else
            {
                result = source.OrderByField(field, isAsc);
            }
            return result ?? source;
        }

        private static string GetSortedPropertyName<T>()
        {
            string propName = null;

            if (!IdTypes.Contains(typeof(T)))
            {
                if (typeof(T).GetInterfaces().Any(s => IdentifiableTypes.Contains(s)))
                    propName = "Id";
                else
                {
                    var propertys = typeof(T).GetProperties();
                    if (propertys.Any())
                        propName = propertys.First().Name;
                }
            }

            return propName;
        }

        public static void AddIfNotNull<T>(this ICollection<T> source, T item)
        {
            if (item != null)
                source.Add(item);
        }

        public static void AddRangeIfNotNull<T>(this ICollection<T> source, IEnumerable<T> items)
        {
            if (items == null) return;
            foreach (var item in items)
            {
                source.Add(item);
            }
        }

        public static IQueryable<T> ThrowIfNotFound<T>(this IQueryable<T> source, string propertyName, string value)
        {
            if (!source.Any())
                EntityNotFoundException.ThrowMe(typeof(T).Name, propertyName, value);

            return source;
        }
    }
}
