using System;
using System.Linq;
using Backend.Entities;
using Backend.Utility;

namespace Backend.DatabaseAccess
{
    public interface IRepositorySearchRequest : IGenericRepository<SearchRequest, Guid>
    {
        IQueryable<SearchRequest> GetUsersSearchHistory(Guid userId, string searchKey, SearchArea area);
        SearchRequest GetSearchRequestByTopic(Guid userId, string searchKey, SearchArea area);
        IQueryable<SearchRequest> GetRequestsForArea(Guid userId, SearchArea area);
        SearchRequest GetSearchRequestByLinkedId(Guid id);
    }
}