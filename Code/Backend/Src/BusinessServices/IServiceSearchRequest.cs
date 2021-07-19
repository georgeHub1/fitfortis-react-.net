using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public interface IServiceSearchRequest 
    {
        Task<ServiceResponse<SearchRequest>> GetRecentHistory(IServiceRequest request, Guid userId, string searchKey, SearchArea area);
        Task<ServiceResponse<SearchRequest>> AddSearchRequest(IServiceRequest request,  SearchRequest searchRequest);
        Task<ServiceResponse<SearchRequest>> RemoveSearchRequestsForArea(IServiceRequest request, Guid userId, SearchArea area);
        Task<ServiceResponse<SearchRequest>> RemoveSearchRequests(IServiceRequest request, Guid id);

        Task<ServiceResponse<SearchRequest>> GetEncyclopediaSearchHistory(IServiceRequest request, Guid userId, string searchKey = null);
    }
}