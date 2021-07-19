using System;
using System.Text.RegularExpressions;

namespace Backend.Utility
{
    public static class MetaTagsGenerator
    {
        public static string GetMetaTags(string title, string description, string imageLink = null)
        {
            var newLine = Environment.NewLine;

            Match imageTagRegx = Regex.Match(description, @"<img src=\s*(.+?)\s*/>");
            Match paragrafRegx = Regex.Match(description, @"<p>\s*(.+?)\s*</p>");


            var imageRegx = Regex.Match(imageTagRegx.Groups[1].Value, @"(http|ftp|https)://([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?");

            var image = imageRegx.Success ? imageRegx.Value : imageLink;
            var paragraph = paragrafRegx.Success ? paragrafRegx.Groups[1].Value : description;


            var metas = $"<meta property=\"og:title\" content=\"{title}\"/>{newLine}" +
                        $"<meta property=\"og:description\" content=\"{paragraph}\"/>{newLine}" +
                        $"<meta property=\"og:image\" content={image}/>{newLine}";

            return metas;
        }
    }
}
