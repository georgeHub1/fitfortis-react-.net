using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Backend
{
    public static class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        private static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseKestrel(it => { it.Limits.MaxRequestBodySize = 100000000; })
                .Build();
    }
}
