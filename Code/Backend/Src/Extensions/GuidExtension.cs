using System;
using System.Linq;

namespace Backend.Extensions
{
    public static class GuidExtension
    {
        public static Guid GenerateGuid(this Guid id, int idCounter)
        {
            var guidArray = id.ToString().Split('-');

            guidArray[4] = idCounter.ToString("D12");

            return new Guid(string.Join('-', guidArray));
        }

        public static string GetLastPart(this Guid id)
        {
            var guidArray = id.ToString().Split('-');

            return guidArray.Last();
        }
    }
}
