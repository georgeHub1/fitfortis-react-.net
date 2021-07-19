using System;

namespace Backend.Configuration
{
    internal class ConfigAppLocalhost : IConfigApp
    {
        public virtual Uri ApiBaseUrl => new Uri("http://localhost:50964/api/1.0/");
        public virtual Uri WebAppBaseUrl => new Uri("http://localhost:5000");
        public virtual string DbConnectionString => @"Server=.\SQLEXPRESS;Database=FitFortis;Trusted_Connection=True;Integrated Security=SSPI;Connection Timeout=30;";
        public virtual string SendgridApiKey => "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";
        public virtual string StorageConnectionString => "DefaultEndpointsProtocol=https;AccountName=fitfortis;AccountKey=eqFwfqIG6ovI/KI/sxTaxhEESNX/g+6NiK5DHf6GxwMH4HWSI3I3x+9+xL56wuoeAIMdbwqGZCe3p7kkpRAp6Q==;EndpointSuffix=core.windows.net";
    }
}
