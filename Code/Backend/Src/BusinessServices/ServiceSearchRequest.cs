using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public class ServiceSearchRequest : BaseService, IServiceSearchRequest
    {
        private readonly IRepositorySearchRequest _repositorySearchRequest;

        public ServiceSearchRequest(IRepositorySearchRequest repositorySearchRequest)
        {
            _repositorySearchRequest = repositorySearchRequest;
        }

        public async Task<ServiceResponse<SearchRequest>> GetRecentHistory(IServiceRequest request, Guid userId, string searchKey, SearchArea area)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositorySearchRequest.GetUsersSearchHistory(userId, searchKey, area).OrderByDescending(it => it.Date);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<SearchRequest>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchRequest>> AddSearchRequest(IServiceRequest request, SearchRequest searchRequest)
        {
            return await ExecuteAsync(() =>
            {
                var existedItem = searchRequest.UserId.HasValue ? _repositorySearchRequest.GetSearchRequestByTopic(searchRequest.UserId.Value, searchRequest.SearchText, searchRequest.SearchArea) : null;

                if (existedItem != null)
                {
                    existedItem.Date = DateTime.UtcNow;

                    _repositorySearchRequest.Update(existedItem);
                }
                else
                {
                    searchRequest.Date = DateTime.UtcNow;

                    existedItem = _repositorySearchRequest.Create(searchRequest);
                }

                _repositorySearchRequest.Save();

                return new ServiceResponse<SearchRequest>(existedItem);

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchRequest>> RemoveSearchRequestsForArea(IServiceRequest request, Guid userId, SearchArea area)
        {
            return await ExecuteAsync(() =>
            {
                SearchRequest searchRequest = null;
                foreach (var search in _repositorySearchRequest.GetRequestsForArea(userId, area).ToList())
                {
                    search.InactiveAt = DateTime.UtcNow;
                    searchRequest = _repositorySearchRequest.Update(search);
                }

                _repositorySearchRequest.Save();

                return new ServiceResponse<SearchRequest>(searchRequest);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchRequest>> RemoveSearchRequests(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var actualEntity = _repositorySearchRequest.GetSearchRequestByLinkedId(id);

                id = actualEntity?.Id ?? id;

                var localEntity = _repositorySearchRequest.SelectById(id);
                localEntity.InactiveAt = DateTime.UtcNow;

                _repositorySearchRequest.Update(localEntity);

                _repositorySearchRequest.Save();

                return new ServiceResponse<SearchRequest>(localEntity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<SearchRequest>> GetEncyclopediaSearchHistory(IServiceRequest request, Guid userId, string searchKey = null)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositorySearchRequest.GetUsersSearchHistory(userId, searchKey, SearchArea.Encyclopedia).OrderByDescending(it => it.Date);

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<SearchRequest>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }
    }
}
