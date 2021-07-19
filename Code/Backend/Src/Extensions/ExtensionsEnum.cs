using System;
using System.ComponentModel;
using System.Globalization;
using System.Linq;

namespace Backend.Extensions
{
    public static class ExtensionsEnum
    {
        public static string GetEnumDescription<TEnum>(this TEnum item)
            => item.GetType()
                   .GetField(item.ToString())
                   .GetCustomAttributes(typeof(DescriptionAttribute), false)
                   .Cast<DescriptionAttribute>()
                   .FirstOrDefault()?.Description ?? string.Empty;

        public static float GetEnumHealthIndexAmount<TEnum>(this TEnum item)
            => Convert.ToSingle(item.GetType()
                   .GetField(item.ToString())
                   .GetCustomAttributes(typeof(DescriptionAttribute), false)
                   .Cast<DescriptionAttribute>()
                   .FirstOrDefault()?.Description ?? string.Empty, CultureInfo.InvariantCulture);
    }
}
