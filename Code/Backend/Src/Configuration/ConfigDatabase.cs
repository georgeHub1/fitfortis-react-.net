using System;
using Backend.DatabaseAccess;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Backend.Configuration
{
    public static class ConfigDatabase
    {
        public static void Init(IServiceCollection services)
        {
            var connectionString = ConfigApp.Settings.DbConnectionString;

            // Warning: Avoid using DbContext Pooling if you maintain your own state(e.g. private fields) in your derived DbContext class that should not be shared across requests.EF Core will only reset the state that is aware of before adding a DbContext instance to the pool.
            //services.AddDbContextPool<DatabaseContext>(options => options.UseSqlServer(connectionString));
            services.AddDbContext<DatabaseContext>(options => 
                options.UseLazyLoadingProxies().UseSqlServer(connectionString));

            services.AddIdentity<User, Role>()
                .AddEntityFrameworkStores<DatabaseContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IUnitOfWork, DatabaseContext>();
        }
    }
}
