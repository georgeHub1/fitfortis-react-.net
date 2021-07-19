using System;
using System.Collections.Generic;
using System.Linq;
using Backend.ModelService;
using Backend.Utility;
using Newtonsoft.Json.Linq;

namespace Backend.Exceptions
{
    [Serializable]
    public class SendGridException : BaseException
    {
        public SendGridException(IDictionary<string, dynamic> errorData)
        {
            if (errorData != null)
            {
                var errors = JToken.Parse(errorData.Values.FirstOrDefault()?.ToString());
                var message = errors[0]?.message?.ToString();
                var field = errors[0]?.field?.ToString();
                ErrorList = new[] { new ValidationError(message, OperationErrorType.EmailProviderError, field) };
            }
           
        }

        public bool IsMultipleErrors => ErrorList != null && ErrorList.Length > 1;
        public ValidationError[] ErrorList { get; set; }
    }

}
