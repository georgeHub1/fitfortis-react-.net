using System.Diagnostics.CodeAnalysis;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Utility
{
    /// <summary>
    ///     RequireHttpsAttribute class
    /// </summary>
    /// <seealso cref="ActionFilterAttribute" />
    [ExcludeFromCodeCoverage]
    public class AttributeRequireHttps : ActionFilterAttribute
    {
        /// <summary>
        ///     Occurs before the action method is invoked.
        /// </summary>
        /// <param name="actionContext">The action context.</param>
        public override void OnActionExecuting(ActionExecutingContext actionContext)
        {
            //#if !(DEBUG || Staging)

            //            if (actionContext.Request.RequestUri.Scheme == Uri.UriSchemeHttps || actionContext.RequestContext.IsLocal)
            //                return;

            //            var controller = actionContext.ControllerContext.Controller as ApiController;
            //            var content = CreateErrorContentResponse();

            //            var negotiatedContentResult =
            //                new NegotiatedContentResult<ApiServiceResponse<ValidationErrorModel>>(
            //                    HttpStatusCode.Forbidden, content, controller);

            //            actionContext.Response = negotiatedContentResult.ExecuteAsync(new CancellationToken(true)).Result;
            //#endif
        }
    }
}