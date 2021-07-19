using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryNews : IGenericRepository<News, Guid>
    {
        IQueryable<News> GetNewsAvailableForLanguage(string language);
        IQueryable<News> GetInactiveNews();
    }
}
