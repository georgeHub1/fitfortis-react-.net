using System;
using System.Linq;
using Backend.Entities;
using Backend.Utility;

namespace Backend.DatabaseAccess
{
    public class RepositorySearchRequest : RepositoryGeneric<SearchRequest, Guid>, IRepositorySearchRequest
    {
        public RepositorySearchRequest(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<SearchRequest> GetUsersSearchHistory(Guid userId, string searchKey, SearchArea area)
        {
            return string.IsNullOrEmpty(searchKey) ? Table.Where(it => it.UserId == userId && it.SearchArea == area) 
                : Table.Where(it => it.UserId == userId && it.SearchText.Contains(searchKey, StringComparison.InvariantCulture) && it.SearchArea == area);
        }

        public SearchRequest GetSearchRequestByTopic(Guid userId, string searchKey, SearchArea area)
        {
            return Table.FirstOrDefault(it => it.UserId == userId && string.Equals(searchKey, it.SearchText, StringComparison.InvariantCulture) && it.SearchArea == area);
        }

        public IQueryable<SearchRequest> GetRequestsForArea(Guid userId, SearchArea area)
        {
            return Table.Where(it => it.UserId == userId && it.SearchArea == area);
        }

        public SearchRequest GetSearchRequestByLinkedId(Guid id)
        {
            return Table.FirstOrDefault(it => it.LinkedEntityId == id);
        }
    }
}