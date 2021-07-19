using System;
using Microsoft.AspNetCore.Http;

namespace Backend.BusinessServices
{
    public interface IServiceLogging 
    {
        void LogException(Exception excepion, HttpRequest request);
    }
}