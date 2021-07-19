using UAParser;

namespace Backend.Utility
{
    public static class UserAgentParser
    {
        public static string GetOs(string userAgent)
        {
            var parser = Parser.GetDefault();

            return !string.IsNullOrEmpty(userAgent) ? parser.Parse(userAgent).OS.ToString() : userAgent;
        }

        public static string GetDevice(string userAgent)
        {
            var parser = Parser.GetDefault();

            return !string.IsNullOrEmpty(userAgent) ? parser.Parse(userAgent).Device.ToString() : userAgent;
        }

        public static string GetBrowser(string userAgent)
        {
            var parser = Parser.GetDefault();

            return !string.IsNullOrEmpty(userAgent) ? parser.Parse(userAgent).UA.ToString() : userAgent;
        }
    }
}
