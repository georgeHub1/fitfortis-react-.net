#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"

//
// This sample demonstrates how to connect to the FitFortis Azure DB.
// See https://docs.microsoft.com/en-us/azure/sql-database/sql-database-connect-query-dotnet-core.
//

using System;
using System.Data.SqlClient;

if (Args.Count != 2)
{
    DisplayUsage();
    Environment.Exit(0);
}

string sql = 
    @"
    SELECT TOP (1000) 
    [dbo].[Metric].[Id]
    ,[dbo].[Metric].[InactiveAt]
    ,[dbo].[Metric].[Code]
    ,[dbo].[Metric].[EncyclopediaId]
    ,[dbo].[EncyclopediaEntity].TitleEnUs
    ,[dbo].[Metric].[Type]
    ,[dbo].[Metric].[DefaultYMin]
    ,[dbo].[Metric].[DefaultYMax]
    ,[dbo].[Metric].[UnitSi]
    ,[dbo].[Metric].[UnitBgBg]
    ,[dbo].[Metric].[UnitEnUs]
    ,[dbo].[Metric].[UnitUkUa]
    ,[dbo].[Metric].[UnitBgBgConversionToSi]
    ,[dbo].[Metric].[UnitEnUsConversionToSi]
    ,[dbo].[Metric].[UnitUkUaConversionToSi]
    ,[dbo].[Metric].[ConversionType]
    ,[dbo].[Metric].[DefaultStroke]
    ,[dbo].[Metric].[DefaultAreaFillOpacity]
    ,[dbo].[Metric].[DefaultBackgroundColor]
    ,[dbo].[Metric].[DefaultBackgroundImage]
    FROM [dbo].[Metric]
    INNER JOIN [dbo].[EncyclopediaEntity]
    ON [dbo].[EncyclopediaEntity].Id=[dbo].[Metric].EncyclopediaId
    ;        
    ";

try
{
    SqlConnectionStringBuilder b = new SqlConnectionStringBuilder();
    b.DataSource = "tcp:fitfortis.database.windows.net,1433";
    b.InitialCatalog = "FitFortis";
    b.UserID = Args[0];
    b.Password = Args[1];

    using (SqlConnection c = new SqlConnection(b.ConnectionString))
    {
        c.Open();
        Console.WriteLine($"\nMETRICS from FF DB ({DateTime.Now}):\n{"".PadRight(40, '=')}");
        Console.Write($"Id".PadRight(38, ' '));
        Console.Write($"Code".PadRight(36,' '));
        Console.Write($"EncyclopediaId".PadRight(38, ' '));
        Console.Write($"TitleEnUs".PadRight(30, ' '));
        Console.Write($"   ");                   
        Console.Write($"DefaultYMin".PadLeft(10, ' ') + " ");
        Console.Write($"DefaultYMax".PadRight(13, ' '));
        Console.Write($"UnitSi".PadRight(11, ' '));
        Console.Write($"UnitBgBg".PadRight(11, ' '));
        Console.Write($"UnitEnUs".PadRight(11, ' '));
        Console.Write($"UnitUkUa".PadRight(11, ' '));
        Console.Write($"DefaultStroke".PadRight(15, ' '));
        Console.WriteLine();
        Console.WriteLine();

        using (SqlCommand cmd = new SqlCommand(sql, c))
        {
            using (SqlDataReader r = cmd.ExecuteReader())
            {
                while (r.Read())
                {
                    Console.Write($"{r[0].ToString()}  ");                   // Id
                    Console.Write($"{r[2].ToString().PadRight(34,' ')}  ");  // Code
                    Console.Write($"{r[3].ToString()}  ");                   // EncyclopediaId
                    Console.Write($"{r[4].ToString().PadRight(30, ' ')}");   // TitleEnUs
                    Console.Write($"{r[5].ToString()}  ");                   // Type
                    Console.Write($"{r[6].ToString().PadLeft(10, ' ')} : "); // DefaultYMin
                    Console.Write($"{r[7].ToString().PadRight(10, ' ')}  "); // DefaultYMax
                    Console.Write($"{r[8].ToString().PadRight(11, ' ')}");  // Unit
                    Console.Write($"{r[9].ToString().PadRight(11, ' ')}");  // UnitsBgBg
                    Console.Write($"{r[10].ToString().PadRight(11, ' ')}"); // UnitsEnUs
                    Console.Write($"{r[11].ToString().PadRight(11, ' ')}"); // UnitsUkUa
                    Console.Write($"{r[16].ToString().PadRight(15, ' ')}"); // DefaultStroke
                    Console.WriteLine();
                }
            }
        }
    }
}
catch (SqlException e)
{
    Console.WriteLine(e);
}

private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <username> <password>");
}
