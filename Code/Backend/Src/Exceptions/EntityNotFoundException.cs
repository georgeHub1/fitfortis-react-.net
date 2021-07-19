using System;
using Backend.Src.Resources;
using Backend.Utility;

namespace Backend.Exceptions
{
    [Serializable]
    public class EntityNotFoundException : BaseException
    {
        public EntityNotFoundException() : base(GetValidationErrorMessage(OperationErrorType.EntityNotFound)) { }

        public EntityNotFoundException(string message) : base(message) { }

        public EntityNotFoundException(string format, params object[] args) : base(string.Format(format, args)) { }

        public static void ThrowMe(string entityName, string propertyName, string propertyValue)
        {
            throw new EntityNotFoundException(
               ValidationErrorMessages.EntityNotFound
               , entityName
               , propertyName
               , propertyValue);
        }

        public EntityNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}
