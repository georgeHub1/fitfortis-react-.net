using System;
using System.Globalization;
using Backend.Src.Resources;
using Backend.Utility;

namespace Backend.Exceptions
{
    [Serializable]
    public class BaseException : ApplicationException
    {
        public BaseException() : base(GetValidationErrorMessage(OperationErrorType.Unknown)) { }

        public BaseException(string message) : base(message) { }

        public BaseException(string format, params object[] args) : base(string.Format(format, args)) { }

        public BaseException(string message, Exception innerException) : base(message, innerException) { }

        public BaseException(string format, Exception innerException, params object[] args) : base(string.Format(format, args), innerException) { }

        public static string GetValidationErrorMessage(OperationErrorType code, params object[] parameters)
        {
            var messageFormat = ValidationErrorMessages.ResourceManager.GetString(code.ToString(), CultureInfo.InvariantCulture);

            if (!string.IsNullOrEmpty(messageFormat))
            {
                return string.Format(messageFormat, parameters);
            }

            return null;
        }

        public static string GetExceptionDetails(Exception ex)
        {
            var errorMessage = string.Empty;

            if (ex != null)
            {
                errorMessage += $"\n\nException: {ex.Message}";
                var innerEx = ex.InnerException;

                while (innerEx != null)
                {
                    errorMessage += $"\n\nInner Exception:\n{innerEx.Message}";
                    innerEx = innerEx.InnerException;
                }

                errorMessage += $"\n\nStackTrace:\n\n{ex.StackTrace}";
            }

            var unknownErrorMessage = "Sorry but we encountered an error. Please contact our support team. We apologize for the inconvenience.";

#if DEBUG || Staging || QA

            unknownErrorMessage += errorMessage;
#endif
            return unknownErrorMessage;
        }
    }
}
