using System;
using System.Linq;
using Backend.Entities;
using Backend.Utility;

namespace Backend.DatabaseAccess
{
    public class RepositoryNewsLikes : RepositoryGeneric<NewsLikesAndComments, Guid>, IRepositoryNewsLikes
    {
        public RepositoryNewsLikes(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public NewsLikesAndComments GetUserLikefoNews(Guid userId, Guid newsId)
        {
            return Table.FirstOrDefault(it => it.UserId == userId && it.NewsId == newsId && it.Type == NewsRecordType.Like);
        }

        public IQueryable<NewsLikesAndComments> GetAllNewsLikes(Guid newsId)
        {
            return Table.Where(it => it.NewsId == newsId);
        }
    }
}
