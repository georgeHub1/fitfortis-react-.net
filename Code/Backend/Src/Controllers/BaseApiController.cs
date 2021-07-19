using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.Exceptions;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Backend.Src.Resources;

namespace Backend.Controllers
{
    //[RequireHttps]
    //[SwaggerResponse(HttpStatusCode.OK, "OK")]
    //[SwaggerResponse(HttpStatusCode.Unauthorized, "Cannot authorize user", typeof(ResponseUnauthorized))]
    //[SwaggerResponse(HttpStatusCode.BadRequest, "Invalid input data", typeof(ResponseErrors<ValidationErrorModel>))]
    //[SwaggerResponse(HttpStatusCode.Forbidden, "Permissions denied (uses model for code 400)")]
    //[SwaggerResponse(HttpStatusCode.NotFound, "Object was not found (uses model for code 400)")]
    //[SwaggerResponse(HttpStatusCode.InternalServerError, "Unexpected server error (uses model for code 400)")]
    [Authorize(AuthenticationSchemes = Constants.AuthenticationSchemes)]
    public class BaseApiController : Controller
    {
        private IUnitOfWork _unitOfWork;
        private IMapper _autoMapper;
        private UserManager<User> _userManager;
        private IServiceLogging _logging;

        private User _user;
        protected IMapper AutomMapper => _autoMapper;

        /// <summary>
        /// Executes the service asynchronous.
        /// </summary>
        /// <typeparam name="TInputApiModel">The type of the input API model.</typeparam>
        /// <typeparam name="TInputServiceEntity">The type of the input service entity.</typeparam>
        /// <typeparam name="TOutputServiceEntity">The type of the output service entity.</typeparam>
        /// <typeparam name="TOutputApiModel">The type of the output API model.</typeparam>
        /// <param name="opertationType">Type of the opertation.</param>
        /// <param name="apiRequest">The API request.</param>
        /// <param name="executor">The executor.</param>
        /// <param name="resultExtractor">The result extractor.</param>
        /// <param name="useTransaction">if set to <c>true</c> [user transaction].</param>
        /// <param name="requestUser"></param>
        /// <returns></returns>
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> ExecuteServiceAsync
                <TInputApiModel, TInputServiceEntity, TOutputServiceEntity, TOutputApiModel>(
                    ApiOperationType opertationType,
                    IApiServiceRequest<TInputApiModel> apiRequest,
                    Func<ServiceRequest<TInputServiceEntity>, Task<ServiceResponse<TOutputServiceEntity>>> executor,
                    Func<ServiceResponse<TOutputServiceEntity>, Task<ModelApiServiceResponse<TOutputApiModel>>> resultExtractor = null,
                    bool useTransaction = true, 
                    bool requestUser = false)
                where TInputApiModel : BaseEntityModel, new()
                where TInputServiceEntity : IBaseEntity
                where TOutputServiceEntity : IBaseEntity
                //where TOutputApiModel : BaseEntityModel
        {
            _unitOfWork = HttpContext.RequestServices.GetService<IUnitOfWork>();
            _autoMapper = HttpContext.RequestServices.GetService<IMapper>();
            _userManager = HttpContext.RequestServices.GetService<UserManager<User>>();
            _logging = HttpContext.RequestServices.GetService<IServiceLogging>();

            try
            {
                // create empty request if null
                if (apiRequest == null)
                {
                    apiRequest = new ModelApiServiceRequest<TInputApiModel>(new TInputApiModel());
                }

                // validate model
                if (!ModelState.IsValid)
                {
                    return CreateErrorContent(HttpStatusCode.BadRequest, ModelState.Where(x => x.Value.Errors.Count > 0).SelectMany(x => x.Value.Errors).Select(x =>
                        new ValidationError(string.IsNullOrEmpty(x.ErrorMessage) ? x.Exception.Message : x.ErrorMessage, OperationErrorType.ApiModelValidation)).ToArray());
                }

                // convert from model -> entity
                var request = _autoMapper.Map<ServiceRequest<TInputServiceEntity>>(apiRequest);

                // init business request
                if (requestUser)
                {
                    request.User = await GetCurrentUserAsync();
                }

                request.Operation = opertationType;

                // start transaction
                var transaction = useTransaction ? _unitOfWork.BeginTransaction() : null;
                using (transaction)
                {
                    // execute service layer
                    var response = await executor(request);

                    if (response != null)
                    {
                        if (response.Success)
                        {
                            // entity -> model convertion
                            ModelApiServiceResponse<TOutputApiModel> result;
                            if (resultExtractor == null)
                            {
                                result = AutomMapper.Map<ModelApiServiceResponse<TOutputApiModel>>(response);
                            }
                            else
                            {
                                result = await resultExtractor(response);
                            }

                            if (useTransaction) _unitOfWork.Commit(transaction);

                            return Ok(result);
                        }

                        if (useTransaction) _unitOfWork.Rollback(transaction);

                        return CreateErrorContent(HttpStatusCode.BadRequest, response.Errors.ToArray());
                    }
                }
            }
            catch (ValidationException validationException)
            {
                return CreateErrorContent(HttpStatusCode.BadRequest, validationException.ErrorList);
            }
            catch (DbUpdateConcurrencyException conflictEx)
            {
                _logging.LogException(conflictEx, Request);
                return CreateErrorContent(HttpStatusCode.Conflict, new ValidationError(string.Format(ValidationErrorMessages.ConcurrencyUpdate, Constants.DbConcurrencyResolveRetryLimit, conflictEx.Message), OperationErrorType.ConcurrencyUpdate));
            }
            catch (DbUpdateException updateEx)
            {
                _logging.LogException(updateEx, Request);
                var message = updateEx.InnerException?.InnerException?.Message;
                return CreateErrorContent(HttpStatusCode.Conflict, new ValidationError(message, OperationErrorType.DataConflict));
            }
            catch (EntityNotFoundException noEntityEx)
            {
                _logging.LogException(noEntityEx, Request);
                return CreateErrorContent(HttpStatusCode.NotFound, new ValidationError(noEntityEx.Message, OperationErrorType.EntityNotFound));
            }
            catch (PermissionDeniedException permissisonEx)
            {
                _logging.LogException(permissisonEx, Request);
                return CreateErrorContent(HttpStatusCode.Forbidden, new ValidationError(permissisonEx.Message, OperationErrorType.PermissionDenied));
            }
            catch (WrongLoginInfoException loginInfoException)
            {
                _logging.LogException(loginInfoException, Request);
                return CreateErrorContent(HttpStatusCode.Forbidden, new ValidationError(loginInfoException.Message, OperationErrorType.WrongLoginInfo));
            }
            catch (AutoMapperMappingException ammex)
            {
                _logging.LogException(ammex, Request);
                return CreateErrorContent(HttpStatusCode.BadRequest, new ValidationError(ammex.Message, OperationErrorType.ApiModelValidation));
            }
            catch (NotExistedAccountException accountException)
            {
                _logging.LogException(accountException, Request);
                return CreateErrorContent(HttpStatusCode.NotFound, new ValidationError(accountException.Message, OperationErrorType.AccounNotExist));
            }
            catch (Exception ex)
            {
                _logging.LogException(ex, Request);
                return CreateErrorContent(HttpStatusCode.InternalServerError, new ValidationError(BaseException.GetExceptionDetails(ex), OperationErrorType.Unknown));
            }
            finally
            {
                _unitOfWork?.Dispose();
            }

            return null;
        }

        /// <summary>
        ///     Creates the content of the error.
        /// </summary>
        /// <param name="httpCode">The HTTP code.</param>
        /// <param name="errors">The errors.</param>
        /// <returns></returns>
        protected IActionResult CreateErrorContent(HttpStatusCode httpCode, params ValidationError[] errors)
        {
            var validationErrorsModel = _autoMapper.Map<List<ModelValidationError>>(errors);
            return StatusCode((int)httpCode, new ModelApiServiceResponse<EmptyEntityModel>
            {
                Errors = validationErrorsModel
            });
        }

        protected async Task<User> GetCurrentUserAsync()
        {
            if (_user == null)
            {
                _user = await _userManager.GetUserAsync(User).ConfigureAwait(false);
            }

            return _user;
        }
    }
}
