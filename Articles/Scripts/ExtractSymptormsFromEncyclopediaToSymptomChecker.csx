#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"
#define DEBUG
//#undef DEBUG

//--------------------------------------------------------------------------------------------------------------------------
//  
//  This script extracts symptoms from Encyclopedia tabe and updates SymptomChecker table.
//  
//  mapping:
//      Encyclopedia                       SymptomChecker
//      OriginalEntryId         ===>       EncyclopediaEntryPossibleCauseOrDiagnosisId
//      Id                      ===>       EncyclopediaEntrySymptomId
//
//
//  To see DEBUG spew, please comment out the #undef DEBUG directive above.
//
//--------------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;


//
// First, ensure we get correct arguments
//
if (Args.Count != 2)
{
    DisplayUsage();
    Environment.Exit(1);
}

var dbUsername = Args[0];
var dbPassword = Args[1];
var dbConnectionString = GenerateConnectionString(dbUsername, dbPassword);

DebugWriteLine("\nIMPORTANT: This is a debug session, because the DEBUG flag has been defined (you can change that in the source code). ");
DebugWriteLine("All debug messages will be shown in this color.");


//
// Second, download the DB in memory
//
Console.WriteLine("\nDownloading ENCYCLOPEDIA entities from db to memory:");
var watch1 = Stopwatch.StartNew();
var encyclopedia = GetEncyclopediaFromDb(dbConnectionString);
watch1.Stop();
Console.WriteLine($"\nDownloaded ENCYCLOPEDIA entities to memory: {encyclopedia.Count}");
Console.WriteLine($"Time for download: {watch1.Elapsed}");

Console.WriteLine("\nDownloading SymptomChecker entities from db to memory:");
var watch2 = Stopwatch.StartNew();
var symptoms = GetSymptomCheckerFromDb(dbConnectionString);
var symptomCheckerNew = new List<SymptomChecker>();
var symptomCheckerUpdated = new List<SymptomChecker>();

watch2.Stop();
Console.WriteLine($"\nDownloaded SymptomChecker entities to memory: {symptoms.Count}");
Console.WriteLine($"Time for download: {watch2.Elapsed}");


//
// Third, create the new and updated entities
//
Console.WriteLine("\n\nExtracting ENCYCLOPEDIA entities to SymptomChecker:");
Console.WriteLine("(updated entities are marked with \".\" and new entities are marked with \"+\")");
var watch3 = Stopwatch.StartNew();
UpdateSymptomChecker(dbConnectionString, symptoms, encyclopedia, symptomCheckerUpdated, symptomCheckerNew);
watch3.Stop();

Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.WriteLine($"Updated SymptomChecker entities: {symptomCheckerUpdated.Count}");
Console.WriteLine($"New Symptom entities: {symptomCheckerNew.Count}");
Console.WriteLine($"Time for upload: {watch3.Elapsed}\n");
Console.ResetColor();


private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <username> <password>");
    Console.WriteLine("\nExtracts symptoms from Encyclopedia to the SymptomChecker");
}

private static void DisplayUsageWithError(string error)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("\nERROR: " + error);
    Console.ResetColor();
    DisplayUsage();
}

private string GenerateConnectionString(string dbUserName, string dbPassword)
{
    SqlConnectionStringBuilder b = new SqlConnectionStringBuilder();
    b.DataSource = "tcp:fitfortis.database.windows.net,1433";
    b.InitialCatalog = "FitFortis";
    b.UserID = dbUserName;
    b.Password = dbPassword;
    return b.ConnectionString;
}

private List<EncyclopediaEntity> GetEncyclopediaFromDb(string connectionString)
{
    List<EncyclopediaEntity> encyclopedia = new List<EncyclopediaEntity>();

    using (SqlConnection c = new SqlConnection(connectionString))
    {
        c.Open();
        string query = "SELECT * FROM [dbo].[EncyclopediaEntity] where OriginalEntryId != '' AND OriginalEntryId IS NOT NULL";
        using (SqlCommand cmd = new SqlCommand(query, c))
        {
            using (SqlDataReader r = cmd.ExecuteReader())
            {
                while (r.Read())
                {
                    encyclopedia.Add(
                        new EncyclopediaEntity
                        {
                            Id = new Guid(r[0].ToString()),
                            OriginalEntryId = r[2].ToString(),
                            BodySystemId = r[3].ToString(),

                            TitleBgBg = r[6].ToString(),
                            TitleEn   = r[11].ToString(),
                            TitleEnUs = r[4].ToString(),
                            TitleUkUa = r[5].ToString(),

                            DescriptionBgBg = r[9].ToString(),
                            DescriptionEn   = r[10].ToString(),
                            DescriptionEnUs = r[7].ToString(),
                            DescriptionUkUa = r[8].ToString(),
                        });
                    Console.Write(".");
                }
            }
        }
    }

    return encyclopedia;
}

private List<SymptomChecker> GetSymptomCheckerFromDb(string connectionString)
{
    List<SymptomChecker> symptomChecker = new List<SymptomChecker>();

    using (SqlConnection c = new SqlConnection(connectionString))
    {
        c.Open();
        string query = "SELECT * FROM [dbo].[SymptomChecker]";
        using (SqlCommand cmd = new SqlCommand(query, c))
        {
            using (SqlDataReader r = cmd.ExecuteReader())
            {
                while (r.Read())
                {
                    symptomChecker.Add(
                        new SymptomChecker
                        {
                            Id = new Guid(r[0].ToString()),
                            EncyclopediaEntrySymptomId = new Guid(r[2].ToString()),
                            EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid(r[3].ToString()),
                            
                        });
                    Console.Write(".");
                }
            }
        }
    }

    return symptomChecker;
}

private void UpdateSymptomChecker(string connectionString, List<SymptomChecker> symptoms, List<EncyclopediaEntity> encyclopedia, List<SymptomChecker> symptomCheckerUpdated, List<SymptomChecker> symptomCheckerNew)
{
    foreach(EncyclopediaEntity encyclopediaEntity in encyclopedia)
    {
        var entity = symptoms.FirstOrDefault(it => it.EncyclopediaEntrySymptomId == encyclopediaEntity.Id);
        
        if(entity != null)
        {
            UpdateSymptomCheckerRecord(connectionString, entity, encyclopediaEntity.OriginalEntryId);
            symptomCheckerUpdated.Add(entity);
            Console.Write(".");
        }
        else
        {
            entity = CreateSymptomCheckerRecord(connectionString, encyclopediaEntity.Id.ToString(), encyclopediaEntity.OriginalEntryId.ToString());
            symptoms.Add(entity);
            symptomCheckerNew.Add(entity);
            Console.Write("+");
        }
    }
}

private SymptomChecker CreateSymptomCheckerRecord(string connectionString, string symptomId, string diagnosisId)
{
    SymptomChecker ent = new SymptomChecker
    {
        Id = Guid.NewGuid(),
        EncyclopediaEntrySymptomId = new Guid(symptomId),
        EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid(diagnosisId)
    };
    
    string sql = $"INSERT INTO SymptomChecker (Id, EncyclopediaEntrySymptomId, EncyclopediaEntryPossibleCauseOrDiagnosisId, ApplicableToMale, ApplicableToFemale, ApplicableToFemalePregnant, MinAgeOfApplicability, MaxAgeOfApplicability)" +
    "Values (@id, @symptomId, @diagnosisId, 'true', 'true', 'true', 0, 0)";
    ExecuteSqlCommand(connectionString, sql, ent.Id.ToString(), ent.EncyclopediaEntrySymptomId.ToString(), ent.EncyclopediaEntryPossibleCauseOrDiagnosisId.ToString());

    return ent;
}

private void UpdateSymptomCheckerRecord(string connectionString, SymptomChecker entity, string diagnosisId)
{
    string sql = $"Update SymptomChecker Set EncyclopediaEntryPossibleCauseOrDiagnosisId = @diagnosisId where Id = @id";
    ExecuteSqlCommand(connectionString, sql, entity.Id.ToString(), entity.EncyclopediaEntrySymptomId.ToString(), diagnosisId);
}

private void ExecuteSqlCommand(string connectionString, string sql, string id, string symptomId, string diagnosisId)
{
    using (SqlConnection conn = new SqlConnection(connectionString))
    {
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@symptomId", symptomId);
        cmd.Parameters.AddWithValue("@diagnosisId", diagnosisId);

        int rowsAffected = cmd.ExecuteNonQuery();
        if (rowsAffected == 0) 
        {
            Console.WriteLine($"ERROR!");
        }
    }
}

private void DebugWrite(string s)
{
#if DEBUG
    Console.ForegroundColor = ConsoleColor.Magenta;
    Console.Write(s);
    Console.ResetColor();
#endif
}

private void DebugWriteLine(string s)
{
#if DEBUG
    Console.ForegroundColor = ConsoleColor.Magenta;
    Console.WriteLine(s);
    Console.ResetColor();
#endif
}

private class EncyclopediaEntity
{
    public Guid Id { get; set; }
    public string OriginalEntryId { get; set; }
    public string BodySystemId { get; set; }

    public string TitleBgBg { get; set; }
    public string TitleEn   { get; set; }  // English (International)
    public string TitleEnUs { get; set; }
    public string TitleUkUa { get; set; }

    public string DescriptionBgBg { get; set; }
    public string DescriptionEn   { get; set; }  // English (International)
    public string DescriptionEnUs { get; set; }
    public string DescriptionUkUa { get; set; }
}

 private class SymptomChecker 
{
    public Guid Id{get;set;}
        public Guid? EncyclopediaEntrySymptomId { get; set; }
        public Guid? EncyclopediaEntryPossibleCauseOrDiagnosisId { get; set; }
        public bool ApplicableToMale { get; set; }
        public bool ApplicableToFemale { get; set; }
        public bool ApplicableToFemalePregnant { get; set; }
        public int MinAgeOfApplicability { get; set; }
        public int MaxAgeOfApplicability { get; set; }
}
