using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryNewsLikes : IGenericRepository<NewsLikesAndComments, Guid>
    {
        NewsLikesAndComments GetUserLikefoNews(Guid userId, Guid newsId);
        IQueryable<NewsLikesAndComments> GetAllNewsLikes(Guid newsId);
    }
}
