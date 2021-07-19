using System;
using System.Linq;
using Backend.DatabaseAccess;
using Backend.Entities;
using Backend.ModelService;
using Microsoft.AspNetCore.Http;

namespace Backend.BusinessServices
{
    public class ServiceLogging : BaseService, IServiceLogging
    {
        private readonly IRepositoryExceptionLog _repositoryExceptionLog;

        public ServiceLogging(IRepositoryExceptionLog repositoryExceptionLog)
        {
            _repositoryExceptionLog = repositoryExceptionLog;
        }


        public void LogException(Exception excepion, HttpRequest request)
        {
            if (excepion != null)
            {
                var text = excepion.Message;

                Exception innerEx = excepion.InnerException;
                while (innerEx != null)
                {
                    text += $"\n\nInner Exception:\n{innerEx.Message}";
                    innerEx = innerEx.InnerException;
                }

                var dbException = new ExceptionLog
                {
                    Date = DateTime.UtcNow,
                    Type = excepion.GetType().ToString(),
                    Source = excepion.StackTrace,
                    Message = text,
                    Url = $"{request?.Path}{request?.QueryString}",
                    Username = request?.HttpContext.User.Claims.FirstOrDefault()?.Value
                };

                _repositoryExceptionLog.Create(dbException);

                _repositoryExceptionLog.Save();
            }
        }
    }
}