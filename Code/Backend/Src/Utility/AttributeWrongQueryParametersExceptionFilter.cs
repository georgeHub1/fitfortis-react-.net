using System.Collections.Generic;
using Backend.Exceptions;
using Backend.ModelService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Backend.Utility
{
    /// <summary>
    /// Describes a exception model
    /// </summary>
    /// <seealso cref="ExceptionFilterAttribute" />
    public class AttributeWrongQueryParametersExceptionFilter : ExceptionFilterAttribute
    {
        /// <summary>
        /// Raises the exception event.
        /// </summary>
        /// <param name="exceptionContext">The context for the action.</param>
        public override void OnException(ExceptionContext exceptionContext)
        {
            if (exceptionContext != null)
            {


                if (!(exceptionContext.Exception is WrongQueryParametersException))
                    return;

                var content = new ModelApiServiceResponse<ModelValidationError>
                {
                    Errors = CreateValidationeErrors((WrongQueryParametersException) exceptionContext.Exception)
                };

                exceptionContext.Result = new BadRequestObjectResult(content);
            }
        }

        internal List<ModelValidationError> CreateValidationeErrors(WrongQueryParametersException exception)
        {
            var result = new List<ModelValidationError>();

            foreach (var message in exception.ErrorMessages)
            {
                result.Add(new ModelValidationError
                {
                    Code = exception.Code,
                    Message = message,
                    Field = exception.Field
                });
            }
            return result;
        }
    }
}