using Microsoft.Extensions.DependencyInjection;
using Swashbuckle.AspNetCore.Swagger;

namespace Backend.Configuration
{
    public static class ConfigSwagger
    {
        public static void Init(IServiceCollection services)
        {
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info { Title = "API", Version = Constants.ApiVersion });
                //c.CustomProvider(defaultProvider => new ODataSwaggerProvider(defaultProvider, c, GlobalConfiguration.Configuration));
            });
        }
    }
}
