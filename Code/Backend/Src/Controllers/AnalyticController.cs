using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class AnalyticController : BaseApiController
    {
        private readonly IServiceUser _serviceUser;
        
        public AnalyticController(IServiceUser serviceUser)
        {
            _serviceUser = serviceUser;
        }

        [HttpPost("sendgrid/event")]
        [AllowAnonymous]
        public async Task<IActionResult> GetSendgridEvent(ModelApiServiceRequest<ModelSendgridResponse> data)
        {

             var reader = new StreamReader(HttpContext.Request.Body);

            var body = await reader.ReadToEndAsync().ConfigureAwait(false);

            var request = JsonConvert.DeserializeObject<List<ModelSendgridResponse>>(body);

            HttpClient client = new HttpClient();

            var content = new StringContent($"{{\"text\":\" EMAIL: <{request.First().Email}> Category: <{request.First().Category}> " +
                                            $"{Environment.NewLine} EVENT: <{request.First().Event}> " +
                                            $"{Environment.NewLine} RESPONSE: <{request.First().Response}> " +
                                            $"{Environment.NewLine} IP: <{request.First().Ip}> " +
                                            $"{Environment.NewLine} ATTEMPT: <{request.First().Attempt}> " +
                                            $"{Environment.NewLine} USERAGENT: <{request.First().Useragent}>\"}}");

            await client.PostAsync(new Uri("https://hooks.slack.com/services/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"), content).ConfigureAwait(false);
            return Ok(request);
        }

        [HttpGet("user/signin")]
        public async Task<IActionResult> GetUserSigninDetailsHistory(ModelApiServiceRequest<ModelMetricDataQueryParams> apiRequest)
        {
            return await ExecuteServiceAsync<ModelMetricDataQueryParams, MetricDataQueryParams, AnalyticUserSigninDetails, ModelAnalyticUserSigninDetails>(
                ApiOperationType.SetUserSessionDuration,
                apiRequest,
                async request => await _serviceUser.GetUserSigninDetails(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPut("session")]
        public async Task<IActionResult> SetSessionDuration([FromBody]ModelApiServiceRequest<ModelAnalyticUserSignIn> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAnalyticUserSignIn, AnalyticUserSignIn, AnalyticUserSignIn, ModelAnalyticUserSignIn>(
                ApiOperationType.SetUserSessionDuration,
                apiRequest,
                async request => await _serviceUser.SetUserSessionDuration(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost("user/signin")]
        [AllowAnonymous]
        public async Task<IActionResult> AddSigninForAnonymousUser([FromBody]ModelApiServiceRequest<ModelAnalyticUserSignIn> apiRequest)
        {
            return await ExecuteServiceAsync<ModelAnalyticUserSignIn, AnalyticUserSignIn, AnalyticUserSignIn, ModelAnalyticUserSignIn>(
                ApiOperationType.SetAnonymousUserLogin,
                apiRequest,
                async request =>
                {
                    var stat = new AnalyticUserSignIn
                    {
                        SignInDatetime = DateTime.UtcNow,
                        UserAgent = Request.Headers[Constants.UserAgentHeaderName],
                        AnonymousId = Guid.NewGuid()
                        
                    };

                    return await _serviceUser.AddLoginToStat(request, stat).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }
    }
}
