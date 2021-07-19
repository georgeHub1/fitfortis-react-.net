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
        string sql = "SELECT COUNT(*) FROM [dbo].[Metric];";
        using (SqlCommand cmd = new SqlCommand(sql, c))
        {
            using (SqlDataReader r = cmd.ExecuteReader())
            {
                while (r.Read())
                {
                    Console.WriteLine("Metrics: {0}", r[0]);
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

