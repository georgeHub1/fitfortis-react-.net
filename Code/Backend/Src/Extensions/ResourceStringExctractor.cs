using System;
using System.Globalization;
using Backend.Configuration;
using Backend.Src.Resources;

namespace Backend.Extensions
{
    public static class ResourceStringExctractor
    {
        public static string GetLocalizedString(string code, string language)
        {
            
            if (string.IsNullOrEmpty(language))
            {
                return String.Empty;
            }

            if (string.Equals(language.ToLowerInvariant(), Constants.International, StringComparison.InvariantCulture))
            {
                language = Constants.Usa;
            }

            var str = language.Replace("-", "", StringComparison.InvariantCulture).ToUpperInvariant();

            return ValidationErrorMessages.ResourceManager.GetString($"{code}{str}", CultureInfo.InvariantCulture);
        }

        public static string GetLocalizedString(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                return String.Empty;
            }

            return ValidationErrorMessages.ResourceManager.GetString($"{code}", CultureInfo.InvariantCulture);
        }
    }
}
