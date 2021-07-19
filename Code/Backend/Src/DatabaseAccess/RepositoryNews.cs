using System;
using System.Linq;
using Backend.Configuration;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryNews : RepositoryGeneric<News, Guid>, IRepositoryNews
    {
        public RepositoryNews(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<News> GetNewsAvailableForLanguage(string language)
        {
            if (language.ToLowerInvariant() == Constants.Usa)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.TitleEnUs));
            }

            if (language.ToLowerInvariant() == Constants.Bulgaria)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.TitleBgBg));
            }

            if (language.ToLowerInvariant() == Constants.Ukraine)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.TitleUkUa));
            }

            if (language.ToLowerInvariant() == Constants.International)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.TitleEn));
            }

            return null;
        }

        public IQueryable<News> GetInactiveNews()
        {
            return GetDbTable<News>().Where(it => it.InactiveAt.HasValue);
        }
    }
}
