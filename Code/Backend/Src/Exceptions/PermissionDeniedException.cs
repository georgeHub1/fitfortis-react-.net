using System;
using Backend.Utility;

namespace Backend.Exceptions
{
    [Serializable]
    public class PermissionDeniedException : BaseException
    {
        public PermissionDeniedException() : base(GetValidationErrorMessage(OperationErrorType.PermissionDenied))
        {
            
        }

        public PermissionDeniedException(string message) : base(message)
        {
        }

        public PermissionDeniedException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
