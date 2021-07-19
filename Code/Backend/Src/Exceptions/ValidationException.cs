using System;
using Backend.ModelService;

namespace Backend.Exceptions
{
    [Serializable]
    public class  ValidationException : BaseException
    {
        public ValidationException(params ValidationError[] errorList)
        {
            ErrorList = errorList;
        }

        public bool IsMultipleErrors => ErrorList != null && ErrorList.Length > 1;
        public ValidationError[] ErrorList { get; set; }

        public ValidationException()
        {
        }

        public ValidationException(string message) : base(message)
        {
        }

        public ValidationException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }

}
