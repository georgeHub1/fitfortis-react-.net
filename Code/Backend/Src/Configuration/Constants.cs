using System;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Backend.Configuration
{
    public static class Constants
    {
        // common
        public const int MaxBatchSize = 1000;
        public const string JwtSecret = "01101ed2-072a-4078-a68f-88eb31506757";
        public const string ShareLink = "https://fitfortis.com/newsfeed/";

        // blobs
        public const string AzureBlobUploadsPublicContainerName = "uploads-public";
        public const string AzureBlobUploadsPrivateContainerName = "uploads-private";
        public const string BlobMetadataFileName = "fileName";
        public const string BlobMetadataUserId = "userId";
        public const int BlobPageSizeInBytes = 10485760;
        public const string SystemAvatarId = "43873740-65c2-47e2-864a-6da45ec0c5b6";
        public const string DefaultFitFortisImage = "https://fitfortis.blob.core.windows.net/uploads-public/newspicture/881d2f54-3780-4787-8df8-5340f21a1c42";

        // auth
        public const string ClaimTypeUserId = "http://schemas.microsoft.com/identity/claims/objectidentifier";
        public const string AuthenticationSchemes = "Bearer";
        public const string JwtKey = "SOME_RANDOM_KEY_DO_NOT_SHARE";
        public const string JwtExpireDays = "30";
        public const string JwtIssuer = "http://yourdomain.com";
        public const string OriginPolicyName = "AllowSpecificOrigin";

        // json serialization
        public static JsonSerializerSettings DefaultJsonSerializerSettings => new JsonSerializerSettings()
        {
            Formatting = Newtonsoft.Json.Formatting.Indented,
            NullValueHandling = NullValueHandling.Ignore,
            DateTimeZoneHandling = DateTimeZoneHandling.Utc,
            DateFormatHandling = DateFormatHandling.IsoDateFormat,
            ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };

        // Roles
        public const string AdminRole = "Admin";
        public const string UserRole = "User";
        public const string SystemFolder = "System";

        // Encryption
        public const string SaltKey = "S@LT&KEY";
        public const string EncryptionKey = "F!tF0rtisKEY";
        
        // email
        public const string EmailFromSupport = "Fit Fortis Support <support@fitfortis.com>";

        // Email Templates
        public const string OnRegistrationConfirmationTemplateId = "4acde01f-67fd-4cab-bc12-2e1147445636";
        public const string OnPasswordForgotTemplateId = "1fd725a1-6cbb-4ce5-a506-d9859acd0e31";
        public const string CustomEmailTemplateId = "131a19c3-c0fa-4876-a372-a6f459e2c8fc";

        // Subjects
        public const string UserConfirmationSubject = "Confirm your email address";
        public const string ForgotUserPasswordSubject = "Reset Password";
        public const string NewsShareSubject = "News Share";

        // database
        public const string SqlDefaultValue = "SqlDefaultValue";
        public const int CommandTimeout = 60; // 1 minute
        public const int DbConcurrencyResolveRetryLimit = 3;
        public const int SearchResultsAmount = 20;
        public const string DefaultLangugageCode = "en-US";

        // API
        public const string ApiVersion = "1.0";
        public const string DefaultControllerRoute = "api/"+ ApiVersion +"/[controller]";
        public const string UserAgentHeaderName = "User-Agent";

        // Audit
        public const string Delete = "DELETE";
        public const string Insert = "INSERT";
        public const string Update = "UPDATE";

        // Encyclopedia 
        public const string Usa = "en-us";
        public const string Ukraine = "uk-ua";
        public const string Bulgaria = "bg-bg";
        public const string International = "en";

        // Metric
        public static readonly Guid TimelineMetricId = new Guid("00000000-0000-0000-0000-000000000017");


        // Profile
        public static readonly Guid SexAtBirth = new Guid("54184ED7-2407-4A70-B5EA-000000000175");
        public static readonly Guid GenderIdentity = new Guid("9E29B91E-0BE0-4EA4-843E-000000000176");
        public static readonly Guid EthnicOrigin = new Guid("11694DCC-F84B-4224-8F4B-000000000177");
        public static readonly Guid BloodGroup = new Guid("ddba30ae-2923-4dfa-bcb8-000000000228");
        public static readonly Guid RhFactor = new Guid("ddba30ae-2923-4dfa-bcb8-000000000230");
        public static readonly Guid Pregnancy = new Guid("ca670a5c-706a-4321-a68c-000000007248");

        public static readonly Guid[] MaleBasicInformationList =
        {
            SexAtBirth, GenderIdentity, EthnicOrigin, BloodGroup, RhFactor
        };
        public static readonly Guid[] FemaleBasicInformationList = 
        {
            SexAtBirth, GenderIdentity, EthnicOrigin, BloodGroup, RhFactor, Pregnancy
        };

        public static readonly Guid Tobacco = new Guid("A6A672C0-F79E-4C35-86EC-000000000178");
        public static readonly Guid Alcohol = new Guid("4AD3ABDF-92F7-471C-8D41-000000000018");
        public static readonly Guid Diet = new Guid("BB53536B-13B0-4A0B-9227-000000000179");
        public static readonly Guid Sport = new Guid("D0A7E9DF-B2F2-492D-846C-000000000180");
        public static readonly Guid SexualActive = new Guid("3032C49B-B93C-4281-AA25-000000000011");
        public static readonly Guid HighProminscuity = new Guid("DF335A01-A336-4590-9081-000000000012");

        public static readonly Guid[] LifestyleList =
        {
            Tobacco, Alcohol, Diet, Sport, SexualActive, HighProminscuity
        };


        public const int HealthIndexBaseValue = 88;
    }
}
