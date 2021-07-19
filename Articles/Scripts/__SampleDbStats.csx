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

List<Statistic> stats = new List<Statistic>()
{
    new Statistic { Name = "Users (all)",                         Sql = "SELECT COUNT(*) FROM [dbo].[AspNetUsers];" },
    new Statistic { Name = "Users (unconf. email)",               Sql = "SELECT COUNT(*) FROM [dbo].[AspNetUsers] WHERE EmailConfirmed='False';" },
    new Statistic { Name = "Users (null DOB)",                    Sql = "SELECT COUNT(*) FROM [dbo].[AspNetUsers] WHERE DateOfBirth IS null;" },
    new Statistic { Name = "Newsfeed (all items)",                Sql = "SELECT COUNT(*) FROM [dbo].[News];" },
    new Statistic { Name = "Newsfeed (bg-bg)",                    Sql = "SELECT COUNT(*) FROM [dbo].[News] WHERE Language='bg-bg';" },
    new Statistic { Name = "Newsfeed (en)",                       Sql = "SELECT COUNT(*) FROM [dbo].[News] WHERE Language='en';" },
    new Statistic { Name = "Newsfeed (en-us)",                    Sql = "SELECT COUNT(*) FROM [dbo].[News] WHERE Language='en-us';" },
    new Statistic { Name = "Newsfeed (uk-ua)",                    Sql = "SELECT COUNT(*) FROM [dbo].[News] WHERE Language='uk-ua';" },
    new Statistic { Name = "Newsfeed (likes)",                    Sql = "SELECT COUNT(*) FROM [dbo].[NewsLikesAndComments];" },
    new Statistic { Name = "Metrics (all)",                       Sql = "SELECT COUNT(*) FROM [dbo].[Metric];" },
    new Statistic { Name = "Metrics (used)",                      Sql = "SELECT COUNT(DISTINCT [MetricId]) FROM [dbo].[MetricData];" },
    new Statistic { Name = "Metrics data (all)",                  Sql = "SELECT COUNT(*) FROM [dbo].[MetricData];" },
    new Statistic { Name = "Metrics data (users with data)",      Sql = "SELECT COUNT(DISTINCT [UserId]) FROM [dbo].[MetricData];" },
    new Statistic { Name = "Documents (all)",                     Sql = "SELECT COUNT(*) FROM [dbo].[Document];" },
    new Statistic { Name = "Documents (deleted)",                 Sql = "SELECT COUNT(*) FROM [dbo].[Document] WHERE InactiveAt IS NOT null;" },
    new Statistic { Name = "Documents (users with docs)",         Sql = "SELECT COUNT(DISTINCT [UserId]) FROM [dbo].[Document];" },
    new Statistic { Name = "Encyclopedia (all items)",            Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity];" },
    new Statistic { Name = "Encyclopedia (orig)",                 Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId IS null OR OriginalEntryId = '');" },
    new Statistic { Name = "Encyclopedia (orig bg-bg w/o desc)",  Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId IS null OR OriginalEntryId = '') AND TitleBgBg IS NOT null AND (DescriptionBgBg IS null OR DescriptionBgBg = '');" },
    new Statistic { Name = "Encyclopedia (orig en    w/o desc)",  Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId IS null OR OriginalEntryId = '') AND TitleEn   IS NOT null AND (DescriptionEn   IS null OR DescriptionEn   = '');" },
    new Statistic { Name = "Encyclopedia (orig en-us w/o desc)",  Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId IS null OR OriginalEntryId = '') AND TitleEnUs IS NOT null AND (DescriptionEnUs IS null OR DescriptionEnUs = '');" },
    new Statistic { Name = "Encyclopedia (orig uk-ua w/o desc)",  Sql = "SELECT COUNT(*) FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId IS null OR OriginalEntryId = '') AND TitleUkUa IS NOT null AND (DescriptionUkUa IS null OR DescriptionUkUa = '');" },
    new Statistic { Name = "Enc. searches (all)",                 Sql = "SELECT COUNT(*) FROM [dbo].[SearchRequest];" },
    new Statistic { Name = "Enc. searches (deleted)",             Sql = "SELECT COUNT(*) FROM [dbo].[SearchRequest] WHERE InactiveAt IS NOT null;" },
    new Statistic { Name = "Symptom Checker (symptoms)",          Sql = "SELECT COUNT(DISTINCT [EncyclopediaEntrySymptomId]) FROM [dbo].[SymptomChecker];" },
    new Statistic { Name = "Symptom Checker (diagnoses)",         Sql = "SELECT COUNT(DISTINCT [EncyclopediaEntryPossibleCauseOrDiagnosisId]) FROM [dbo].[SymptomChecker];" },
};

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
        Console.WriteLine($"\nSTATS from FF DB ({DateTime.Now}):\n{"".PadRight(42, '=')}");
        foreach (Statistic s in stats)
        {
            using (SqlCommand cmd = new SqlCommand(s.Sql, c))
            {
                using (SqlDataReader r = cmd.ExecuteReader())
                {
                    while (r.Read())
                    {
                        Console.WriteLine($"{s.Name.PadRight(35, ' ')}:{r[0].ToString().PadLeft(6,' ')}");
                    }
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

private class Statistic
{
    public string Name;
    public string Sql;
}
