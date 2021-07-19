using Backend.Configuration;
using Microsoft.AspNet.OData.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Backend
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public static void ConfigureServices(IServiceCollection services)
        {

            // In production, the React files will be served from this directory
            //services.AddSpaStaticFiles(configuration => { configuration.RootPath = "../ClientApp/build"; });

            ConfigDependencyInjection.Init(services);
            ConfigAutoMapper.Init(services);
            ConfigSwagger.Init(services);
            ConfigAuth.Init(services);
            ConfigDatabase.Init(services);
            ConfigOData.Init(services);
            ConfigMvc.Init(services);
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //Swagger documentation
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1");
            });

            // Authentication
            app.UseHttpsRedirection();
            app.UseAuthentication();
            //app.UseMvcWithDefaultRoute();
            //app.UseStaticFiles();
            //app.UseSpaStaticFiles();

            app.UseCors(Constants.OriginPolicyName);

            app.UseMvc(routeBuilder =>
            {
                routeBuilder.MapODataServiceRoute("odata", "odata", ConfigOData.GetEdmModel(app.ApplicationServices));

                // Workaround for Swagger: https://github.com/OData/WebApi/issues/1175
                routeBuilder.EnableDependencyInjection();
            });

            //app.UseSpa(spa =>
            //{
            //    spa.Options.SourcePath = "../ClientApp";

            //    if (env.IsDevelopment())
            //    {
            //        spa.UseReactDevelopmentServer(npmScript: "start");
            //    }
            //});
        }
    }
}
