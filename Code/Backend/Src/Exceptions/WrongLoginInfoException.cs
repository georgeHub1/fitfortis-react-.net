using System;
using Backend.Utility;

namespace Backend.Exceptions
{
    [Serializable]
    public class WrongLoginInfoException : BaseException
    {
        public WrongLoginInfoException() : base(GetValidationErrorMessage(OperationErrorType.WrongLoginInfo))
        {

        }

        public WrongLoginInfoException(string message) : base(message)
        {
        }

        public WrongLoginInfoException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}