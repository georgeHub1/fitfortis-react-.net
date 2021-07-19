using System;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class NewsController : BaseApiController
    {
        private readonly IServiceNews _serviceNews;
        private readonly IServiceEventProcessor _eventProcessorService;
        private readonly IServiceUser _serviceUser;
        private readonly IBlobService _blobService;
        private readonly IServiceSearchRequest _serviceSearchRequest;

        public NewsController(IServiceNews serviceNews, IServiceEventProcessor serviceEventProcessor, IServiceUser serviceUser, IBlobService blobService, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceNews = serviceNews;
            _eventProcessorService = serviceEventProcessor;
            _serviceUser = serviceUser;
            _blobService = blobService;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNews(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, NewsDetails, ModelNewsDetails>(
                ApiOperationType.GetNews,
                apiRequest,
                async request => await _serviceNews.GetNews(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{newsId:Guid}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetNewsById(Guid newsId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, NewsDetails, ModelNewsDetails>(
                ApiOperationType.GetNewsById,
                apiRequest,
                async request => await _serviceNews.GetNewsById(request, newsId).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet]
        public async Task<IActionResult> GetNewsByLink( ModelApiServiceRequest<ModelGetNewsQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelGetNewsQueryParams, GetNewsQueryParams, NewsDetails, ModelNewsDetails>(
                ApiOperationType.GetNewsByLink,
                apiRequest,
                async request => await _serviceNews.GetNewsByLink(request, request.Data).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{newsId:Guid}/picture/download")]
        public async Task<FileContentResult> DownloadAvatar(Guid newsId)
        {
            var news = await _serviceNews.GetNewsById(null, newsId).ConfigureAwait(false);
            var newsResult = news.Item;


            var request = await _blobService.DownloadFileAsync(AttachmentType.NewsPicture, newsResult.PictureId ?? Guid.Empty).ConfigureAwait(false);

            var result = request.Item;

            var contentType = new MediaTypeHeaderValue(result.ContentType).ToString();
            var fileBytes = result.Stream.GetBuffer();

            return new FileContentResult(fileBytes, contentType)
            {
                FileDownloadName = result.FileName
            };
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetNewsSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetNewsSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetRecentHistory(request, userId, null, SearchArea.News).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        [AllowAnonymous]
        public async Task<IActionResult> AddNewsSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddNewsSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.News;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpPost]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> CreateNews([FromBody]ModelApiServiceRequest<ModelNews> apiRequest)
        {
            return await ExecuteServiceAsync<ModelNews, News, News, ModelNews>(
                ApiOperationType.CreateNews,
                apiRequest,
                async request => await _serviceNews.CreateNews(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("like")]
        public async Task<IActionResult> LkeNews([FromBody]ModelApiServiceRequest<ModelCreateLike> apiRequest)
        {
            return await ExecuteServiceAsync<ModelCreateLike, CreateLike, NewsLikesAndComments, ModelNewsLikesAndComments>(
                ApiOperationType.LikeNews,
                apiRequest,
                async request => await _serviceNews.AddLike(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("share/email")]
        public async Task<IActionResult> ShareNewsViaEmail([FromBody]ModelApiServiceRequest<ModelShareEmail> apiRequest)
        {
            return await ExecuteServiceAsync<ModelShareEmail, ShareEmail, NewsDetails, ModelNewsDetails>(
                ApiOperationType.ShareViaEmail,
                apiRequest,
                async request =>
                {
                    var user = await _serviceUser.GetUserById(request, request.Data.UserIdFrom).ConfigureAwait(false);
                    var userResult = user.Item;
                    var news = await _serviceNews.GetNewsById(request, request.Data.NewsId).ConfigureAwait(false);
                    var toUser = new User{Email = request.Data.EmailTo};

                    await _eventProcessorService.OnNewsShareAsync(request, userResult, toUser, request.Data.EmailBody).ConfigureAwait(false);

                    return news;
                }).ConfigureAwait(false);
        }

        [HttpPost("picture/upload")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> UploadNewsPicture([FromForm] ModelUploadFile fileRequest)
        {
            var apiRequest = new ModelApiServiceRequest<ModelUploadFile> { Data = fileRequest };
            return await ExecuteServiceAsync<ModelUploadFile, UploadFile, FileUploadDetails, ModelFileUploadDetails>(
                ApiOperationType.UploadNewsPicture,
                apiRequest,
                async request => await _blobService.UploadFileAsync(AttachmentType.NewsPicture, request.Data.File, Guid.Empty).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> UpdateNews(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateNews> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateNews, UpdateNews, News, ModelNews>(
                ApiOperationType.UpdateNews,
                apiRequest,
                async request => await _serviceNews.UpdateNews(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        [Authorize(Roles = Constants.AdminRole)]
        public async Task<IActionResult> DeleteNews(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, News, ModelNews>(
                ApiOperationType.DeleteNews,
                apiRequest,
                async request =>
                {
                    await _blobService.RemoveFileAsync(AttachmentType.NewsPicture, id).ConfigureAwait(false);
                    return await _serviceNews.DeleteNews(request, id).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpDelete("{newsId:Guid}/user/{userId:Guid}/like")]
        public async Task<IActionResult> DeleteLike(Guid userId, Guid newsId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, NewsLikesAndComments, ModelNewsLikesAndComments>(
                ApiOperationType.DeleteLike,
                apiRequest,
                async request => await _serviceNews.RemoveLike(request, userId, newsId).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteNewsSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteNewsSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
