using System;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.Utility;
using Microsoft.EntityFrameworkCore;

//namespace Backend.DatabaseAccess
//{
    //class Program
    //{
        //public static ExitCodeType _exitCode = ExitCodeType.ApplicationError;

        //static int Main(string[] args)
        //{
        //    using (_loggerFactory = new LoggerFactory()
        //        .AddConsole(LogLevel.Trace, true)
        //        .AddDebug(LogLevel.Trace))
        //    {
        //        _logger = _loggerFactory.CreateLogger<Program>();

        //        Parser.Default.ParseArguments<CommandLineOptions>(args)
        //            .WithParsed(opts => Run(opts).Wait());
        //        //.WithNotParsed<Options>((errs) => _logger.LogError(errs.Select(x => x));
        //    }

        //    return (int)_exitCode;
        //}

        //private static async Task Run(CommandLineOptions options)
        //{
        //    var startedAt = DateTime.Now;

        //    try
        //    {
        //        await CreateOrMigrateDbContextAsync(options).ConfigureAwait(false);


        //        _exitCode = ExitCodeType.Success;
        //    }
        //    catch (Exception)
        //    {
        //        _exitCode = ExitCodeType.ApplicationError;
        //    }
        //}

        //private static async Task CreateOrMigrateDbContextAsync(CommandLineOptions options)
        //{
        //    var rootDbOptions = new DbContextOptionsBuilder<DatabaseContext>();
        //    rootDbOptions.UseSqlServer(ConfigApp.Settings.DbConnectionString);

        //    using (var rootDbContext = new DatabaseContext(rootDbOptions.Options, null))
        //    {
        //        await rootDbContext.CreateOrMigrateAsync(options.IsClean).ConfigureAwait(false);
        //    }
        //}
//    }

//}
