using Backend.Entities;
using Backend.Exceptions;
using Backend.Utility;

namespace Backend.ModelService
{
    public class ValidationError : BaseEntity
    {
        public ValidationError(string message, OperationErrorType code, string field = null)
        {
            Message = message;
            Code = code;
            Field = field;
        }

        public ValidationError(OperationErrorType code, string field = null, params object[] parameters)
        {
            Message = BaseException.GetValidationErrorMessage(code, parameters);
            Code = code;
            Field = field;
        }

        public string Message { get; set; }
        public OperationErrorType Code { get; set; }
        public string Field { get; set; }
    }

}
