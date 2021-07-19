using System.Collections.Generic;
using System.Linq;

namespace Backend.Extensions
{
    public static class ExtensionList
    {
        public static string ToCommaSeparatedString<T>(this IEnumerable<T> list)
        {
            return string.Join(",", list.Select(x => x.ToString()));
        }
    }
}