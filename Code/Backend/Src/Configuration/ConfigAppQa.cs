
using System;

namespace Backend.Configuration
{
    internal class ConfigAppQa : ConfigAppLocalhost
    {
        public override Uri ApiBaseUrl => new Uri("https://fitforts.com/api/1.0/");
        public override Uri WebAppBaseUrl => new Uri("https://fitfortis.com");
        public override string DbConnectionString => @"Server=tcp:fitfortis.database.windows.net,1433;Initial Catalog=FitFortis;Persist Security Info=False;User ID=FitFortis_admin;Password=ZRiE238pZBCqdGn;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
        public override string SendgridApiKey => "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";
        public override string StorageConnectionString => "DefaultEndpointsProtocol=https;AccountName=fitfortis;AccountKey=eqFwfqIG6ovI/KI/sxTaxhEESNX/g+6NiK5DHf6GxwMH4HWSI3I3x+9+xL56wuoeAIMdbwqGZCe3p7kkpRAp6Q==;EndpointSuffix=core.windows.net";
    }
}
