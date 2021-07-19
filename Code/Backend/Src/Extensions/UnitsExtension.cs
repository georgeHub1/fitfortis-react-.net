using System.Globalization;
using Backend.Entities;
using Backend.Utility;
using UnitsNet;

namespace Backend.Extensions
{
    public static class UnitsExtension
    {
        public static float? SetValue(this Metric metric, float? originalValue, string locale)
        {
            if (metric == null || !originalValue.HasValue || string.IsNullOrEmpty(locale))
            {
                return originalValue;
            }

            var convertionalValue = metric.GetConvertionalValue(locale);

            switch (metric.ConversionType)
            {
                case ConversionType.MulDiv:
                    var success = float.TryParse(convertionalValue, NumberStyles.Any, CultureInfo.InvariantCulture, out var value);
                    return success ? originalValue * value : originalValue;
                case ConversionType.Converter:
                    if (convertionalValue == "F")
                    {
                        var farenheits = Temperature.FromDegreesFahrenheit(originalValue.Value);
                        return (float) farenheits.Kelvins;
                    }
                    if (convertionalValue == "C")
                    {
                        var farenheits = Temperature.FromDegreesCelsius(originalValue.Value);
                        return (float)farenheits.Kelvins;
                    }
                    return originalValue;
                default:
                    return originalValue;
            }
        }


        public static float? GetDisplayValue(this Metric metric, float? siValue, string locale)
        {
            if (metric == null || !siValue.HasValue || string.IsNullOrEmpty(locale))
            {
                return siValue;
            }

            var convertionalValue = metric.GetConvertionalValue(locale);

            switch (metric.ConversionType)
            {
                case ConversionType.MulDiv:
                    var success = float.TryParse(convertionalValue, NumberStyles.Any, CultureInfo.InvariantCulture, out var value);
                    return success ? siValue / value : siValue;
                case ConversionType.Converter:
                    if (convertionalValue == "F")
                    {
                        var farenheits = Temperature.FromKelvins(siValue.Value);
                        return (float)farenheits.DegreesFahrenheit;
                    }
                    if (convertionalValue == "C")
                    {
                        var farenheits = Temperature.FromKelvins(siValue.Value);
                        return (float)farenheits.DegreesCelsius;
                    }
                    return siValue;
                default:
                    return siValue;
                    
            }
        }

    }
}
