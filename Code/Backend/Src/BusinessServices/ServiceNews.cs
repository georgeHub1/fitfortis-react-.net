using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Extensions;
using Backend.ModelService;
using Backend.Utility;

namespace Backend.BusinessServices
{
    public class ServiceNews : BaseService, IServiceNews
    {
        private readonly IRepositoryNews _repositoryNews;
        private readonly IRepositoryNewsLikes _repositoryNewsLikes;
        private readonly IRepositoryUser _repositoryUser;

        public ServiceNews(IRepositoryNews repositoryNews, IRepositoryNewsLikes repositoryNewsLikes, IRepositoryUser repositoryUser)
        {
            _repositoryNewsLikes = repositoryNewsLikes;
            _repositoryNews = repositoryNews;
            _repositoryUser = repositoryUser;
        }

        public async Task<ServiceResponse<NewsDetails>> GetNews(IServiceRequest request, string languageCode)
        {
            return await ExecuteAsync(() =>
            {
                var news = _repositoryNews.GetNewsAvailableForLanguage(languageCode);

                var count = news.Count();

                var pagedData = news.Select(request.Paging, request.Sorting);

                return new ServiceResponse<NewsDetails>(pagedData.Select(it => new NewsDetails
                {
                    Id = it.Id,
                    Title = it.GetTitle(languageCode),
                    Description = it.GetDescription(languageCode),
                    Date = it.Date,
                    PictureId = it.PictureId,
                    PictureUrl = it.PictureUrl,
                    Likes = it.LikesAndComments.Count(like => like.Type == NewsRecordType.Like),
                    ShareLink = $"{Constants.ShareLink}{it.Id}",
                    Language = it.Language
                }).ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> GetNews(IServiceRequest request)
        {
            return await ExecuteAsync(() =>
            {
                var data = _repositoryNews.SelectAll();

                var count = data.Count();

                var pagedData = data.Select(request.Paging, request.Sorting);

                return new ServiceResponse<News>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> GetInactiveNews(IServiceRequest request)
        {
            return await ExecuteAsync(() =>
            {
                var news = _repositoryNews.GetInactiveNews();

                var count = news.Count();

                var pagedData = news.Select(request.Paging, request.Sorting);

                return new ServiceResponse<News>(pagedData.ToList(), count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> RestoreNewsFromBin(IServiceRequest request, KeysData<Guid> ids)
        {
            return await ExecuteAsync(() =>
            {
                var listIds = ids.Keys;

                var data = _repositoryNews.GetInactiveNews().Where(it => listIds.Contains(it.Id)).ToList();

                foreach (var news in data.ToList())
                {
                    news.InactiveAt = null;

                    _repositoryNews.Update(news);
                }

                _repositoryNews.Save();

                return new ServiceResponse<News>(data, data.Count);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> InactivateNews(IServiceRequest request, Guid id)
        {
            return await ExecuteAsync(() =>
            {
                var localNews = _repositoryNews.SelectById(id);

                localNews.InactiveAt = DateTime.UtcNow;

                _repositoryNews.Update(localNews);
                _repositoryNews.Save();

                return new ServiceResponse<News>(localNews);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<NewsDetails>> GetNewsById(IServiceRequest request, Guid newsId)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryNews.SelectById(newsId);
                var title = entity.GetTitle(entity.Language);
                var description = entity.GetDescription(entity.Language);

                return new ServiceResponse<NewsDetails>(new NewsDetails
                {
                    Id = entity.Id,
                    Title = title,
                    Description = entity.GetDescription(entity.Language),
                    Date = entity.Date,
                    PictureId = entity.PictureId,
                    PictureUrl = entity.PictureUrl,
                    Likes = entity.LikesAndComments.Count(like => like.Type == NewsRecordType.Like),
                    ShareLink = $"{Constants.ShareLink}{entity.Id}",
                    Language = entity.Language,
                    MetaTags = MetaTagsGenerator.GetMetaTags(title, description, Constants.DefaultFitFortisImage)
                });
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<NewsDetails>> GetNewsByLink(IServiceRequest request, GetNewsQueryParams queryParams)
        {
            return await ExecuteAsync(() =>
            {
                var formattedLink = queryParams.Link.Replace(" ", "+");
                var paredLink = formattedLink.Decrypt();
                var ids = paredLink.Split('/');
                var newsId = new Guid(ids[1].Split(':')[1]);
                var languageCode = ids[2].Split(':')[1];

                if (queryParams.UserId.HasValue)
                {
                    var user = _repositoryUser.SelectById(queryParams.UserId.Value);
                    languageCode = user.Language;
                }

                var entity = _repositoryNews.SelectById(newsId);

                return new ServiceResponse<NewsDetails>(new NewsDetails
                {
                    Id = entity.Id,
                    Title = entity.GetTitle(languageCode),
                    Description = entity.GetDescription(languageCode),
                    Date = entity.Date,
                    PictureId = entity.PictureId,
                    PictureUrl = entity.PictureUrl,
                    Likes = entity.LikesAndComments.Count(like => like.Type == NewsRecordType.Like),
                    IsLiked = queryParams.UserId.HasValue && entity.LikesAndComments.Any(like => like.UserId == queryParams.UserId && like.Type == NewsRecordType.Like),
                    Language = entity.Language
                });

            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> CreateNews(IServiceRequest request, News news)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryNews.Create(news);

                _repositoryNews.Save();

                return new ServiceResponse<News>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> UpdateNews(IServiceRequest request, Guid newsId, UpdateNews news)
        {
            return await ExecuteAsync(() =>
            {
                var localNews = _repositoryNews.SelectById(newsId);

                localNews.MapChanges(news);

                _repositoryNews.Update(localNews);
                _repositoryNews.Save();

                return new ServiceResponse<News>(localNews);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> DeleteNews(IServiceRequest request, Guid newsId)
        {
            return await ExecuteAsync(() =>
            {
                RemoveNewsLikes(newsId);

                var entity = _repositoryNews.Delete(newsId);
                _repositoryNews.Save();

                return new ServiceResponse<News>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<NewsLikesAndComments>> AddLike(IServiceRequest request, CreateLike userLike)
        {
            return await ExecuteAsync(() =>
            {
                var entity = _repositoryNewsLikes.GetUserLikefoNews(userLike.UserId, userLike.NewsId);
                if (entity == null)
                {
                    entity = _repositoryNewsLikes.Create(new NewsLikesAndComments
                    {
                        UserId = userLike.UserId,
                        NewsId = userLike.NewsId,
                        Date = DateTime.UtcNow,
                        Type = NewsRecordType.Like
                    });

                    _repositoryNewsLikes.Save();
                }

                return new ServiceResponse<NewsLikesAndComments>(entity);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<NewsLikesAndComments>> RemoveLike(IServiceRequest request, Guid userId, Guid newsId)
        {
            return await ExecuteAsync(() =>
            {
                var userLike = _repositoryNewsLikes.GetUserLikefoNews(userId, newsId);

                _repositoryNewsLikes.Delete(userLike.Id);
                _repositoryNewsLikes.Save();

                return new ServiceResponse<NewsLikesAndComments>(userLike);
            }).ConfigureAwait(false);
        }

        public async Task<ServiceResponse<News>> UpdatePictureId(IServiceRequest request, Guid newsId, Guid pictureId, string pictureUrl)
        {
            return await ExecuteAsync(() =>
            {
                var localNews = _repositoryNews.SelectById(newsId);

                localNews.PictureId = pictureId;
                localNews.PictureUrl = pictureUrl;

                _repositoryNews.Update(localNews);
                _repositoryNews.Save();

                return new ServiceResponse<News>(localNews);
            }).ConfigureAwait(false);
        }

        private string GetShareLink(Guid userId, Guid newsId, string languageCode)
        {
            var host = "https://fitfortis/";
            var token = $"userId:{userId}/newsId:{newsId}/languageCode:{languageCode}".Encrypt();

            return $"{host}/{token}";
        }

        private void RemoveNewsLikes(Guid newsId)
        {
            foreach (var like in _repositoryNewsLikes.GetAllNewsLikes(newsId).ToList())
            {
                _repositoryNewsLikes.Delete(like.Id);
            }

            _repositoryNewsLikes.Save();
        }
    }
}
