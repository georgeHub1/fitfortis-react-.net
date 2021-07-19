using System;
using System.Threading.Tasks;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.BusinessServices
{
    public interface IServiceNews
    {
        Task<ServiceResponse<NewsDetails>> GetNews(IServiceRequest request, string languageCode);
        Task<ServiceResponse<News>> GetNews(IServiceRequest request);
        Task<ServiceResponse<News>> GetInactiveNews(IServiceRequest request);
        Task<ServiceResponse<News>> RestoreNewsFromBin(IServiceRequest request, KeysData<Guid> ids);
        Task<ServiceResponse<News>> InactivateNews(IServiceRequest request, Guid id);
        Task<ServiceResponse<NewsDetails>> GetNewsById(IServiceRequest request, Guid newsId);
        Task<ServiceResponse<NewsDetails>> GetNewsByLink(IServiceRequest request, GetNewsQueryParams queryParams);
        Task<ServiceResponse<News>> CreateNews(IServiceRequest request, News news);
        Task<ServiceResponse<News>> UpdateNews(IServiceRequest request, Guid newsId, UpdateNews news);
        Task<ServiceResponse<News>> DeleteNews(IServiceRequest request, Guid newsId);
        Task<ServiceResponse<NewsLikesAndComments>> AddLike(IServiceRequest request, CreateLike userLike);
        Task<ServiceResponse<NewsLikesAndComments>> RemoveLike(IServiceRequest request, Guid userId, Guid newsId);
        Task<ServiceResponse<News>> UpdatePictureId(IServiceRequest request, Guid newsId, Guid pictureId, string pictureUrl);


    }
}
