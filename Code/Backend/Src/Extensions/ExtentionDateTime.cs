using System;

namespace Backend.Extensions
{
    public static class ExtentionDateTime
    {
        public static long? GetNextDayTimestamp(this DateTime date)
        {
            DateTime epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);

            var nextDay = date.AddHours(24);

            TimeSpan elapsedTime = nextDay - epoch;
            return (long)elapsedTime.TotalSeconds;
        }
    }
}