#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"
#define DEBUG
//#undef DEBUG

//--------------------------------------------------------------------------------------------------------------------------
//  
//  This script reads a set of files from a given directory and uploads them as Encyclopedia entitities, to the database.
//  The files on disk are expected to have the following naming (notice how "--" are used as separators):
//      xxxxxxxxxxxx--yyyyyyyyyyyy--EnUs--Some title.html
//
//  where:
//      xxxxxxxxxxxx : is the ID of the Encyclopedia entity
//      yyyyyyyyyyyy : is the ID of the original Encyclopedia entity (if xxxxxxxxxxxx is a synonym)
//      EnUs         : is the locale (EnUs, BgBg, etc.)
//      Some title   : is the title
//
//  The script first downloads the Encyclopedia from the db. The it compares the IDs of the files in the local directory, 
//  to determine whether they are new articles or updates to existing articles. Finally, the script uploads the articles 
//  from disk (either as an update to the db, or as new entries)
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
if (Args.Count != 3)
{
    DisplayUsage();
    Environment.Exit(1);
}

var dbUsername = Args[0];
var dbPassword = Args[1];
var dbConnectionString = GenerateConnectionString(dbUsername, dbPassword);
var directoryPath = Args[2];
if (!Directory.Exists(directoryPath)) 
{
    DisplayUsageWithError($"The directory \"{directoryPath}\" does not exist!");
    Environment.Exit(1);
}
DebugWriteLine("\nIMPORTANT: This is a debug session, because the DEBUG flag has been defined (you can change that in the source code). ");
DebugWriteLine("All debug messages will be shown in this color.");


//
// Second, download the DB in memory
//
Console.WriteLine("\nDownloading ENCYCLOPEDIA entities from db to memory:");
var watch1 = Stopwatch.StartNew();
var encyclopedia = GetEncyclopediaFromDb(dbConnectionString);
var encyclopediaNew = new List<EncyclopediaEntity>();
var encyclopediaUpdated = new List<EncyclopediaEntity>();
watch1.Stop();
Console.WriteLine($"\nDownloaded ENCYCLOPEDIA entities to memory: {encyclopedia.Count}");
Console.WriteLine($"Time for download: {watch1.Elapsed}");


//
// Third, upload the new and updated entities
//
Console.WriteLine("\n\nUploading ENCYCLOPEDIA entities to db:");
Console.WriteLine($"Directory: \"{directoryPath}\"");
var files = Directory.GetFiles(directoryPath);
Console.WriteLine($"Files for upload discovered: {files.Length}");
Console.WriteLine("(updated entities are marked with \".\" and new entities are marked with \"+\")");
var watch2 = Stopwatch.StartNew();
UploadFromFiles(dbConnectionString, files, encyclopedia, encyclopediaUpdated, encyclopediaNew);
watch2.Stop();

Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.WriteLine($"Updated ENCYCLOPEDIA entities: {encyclopediaUpdated.Count}");
Console.WriteLine($"New ENCYCLOPEDIA entities: {encyclopediaNew.Count}");
Console.WriteLine($"Time for upload: {watch2.Elapsed}\n");
Console.ResetColor();


private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <username> <password> <directorypath>");
    Console.WriteLine("\nUploads all ENCYCLOPEDIA entries, from the HTML file into Azure Database.");
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
        string query = "SELECT * FROM [dbo].[EncyclopediaEntity]";
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

private void UploadFromFiles(string connectionString, string[] files, List<EncyclopediaEntity> encyclopedia, List<EncyclopediaEntity> encyclopediaUpdated, List<EncyclopediaEntity> encyclopediaNew)
{
    foreach (var file in files)
    {
        var fileElements = ParseFileName(file);
        var ent = FindEncyclopediaEntity(fileElements[0], encyclopedia);
        var originalId = GetOriginalIdFromLast12digits(fileElements[1], encyclopedia);
        var locale = fileElements[2];
        var title = EncodeTitle(fileElements[3]);
        var description = File.ReadAllText(file);
        
        if (ent != null)
        {
            // An article with the same ID has been found in the Encyclopedia.
            // We need to update that article
            UpdateEncyclopediaEntity(connectionString, ent, originalId, locale, title, description);
            encyclopediaUpdated.Add(ent);
            Console.Write(".");
        }
        else
        {
            // This is a new article that we need to create
            ent = CreateEncyclopediaEntity(connectionString, fileElements[0], originalId, locale, title, description);
            encyclopedia.Add(ent);
            encyclopediaNew.Add(ent);
            Console.Write("+");
        }
        DebugWrite($"id:{ent.Id.ToString().PadRight(36)} ");
        DebugWrite($"origId:{(originalId != null ? originalId.PadRight(36) : " ".PadRight(36))}  ===> ");
        DebugWriteLine($"{fileElements[0]}  {fileElements[1]}  {locale}  {title} ");
    }
    Console.WriteLine();
}

private EncyclopediaEntity FindEncyclopediaEntity(string lastDigits, List<EncyclopediaEntity> encyclopedia)
{
    return encyclopedia.FirstOrDefault(it => it.Id.ToString().Substring(24,12) == lastDigits);
}

private EncyclopediaEntity CreateEncyclopediaEntity(string connectionString, string id, string originalId, string locale, string title, string description)
{
    string dbFieldTitle = "Title" + locale;
    string dbFieldDesc = "Description" + locale;

    EncyclopediaEntity ent = new EncyclopediaEntity();
    ent.Id = GenerateGuid(id);
    ent.OriginalEntryId = originalId;
    ent.GetType().GetProperty(dbFieldTitle).SetValue(ent, title, null);
    ent.GetType().GetProperty(dbFieldDesc).SetValue(ent, description, null);

    string sql = $"INSERT INTO EncyclopediaEntity (Id, OriginalEntryId, {dbFieldTitle}, {dbFieldDesc}) Values (@id, @originalId, @title, @description)";
    ExecuteSqlCommand(connectionString, sql, ent.Id.ToString(), originalId, title, description);

    return ent;
}

private void UpdateEncyclopediaEntity(string connectionString, EncyclopediaEntity ent, string originalId, string locale, string title, string description)
{
    string dbFieldTitle = "Title" + locale;
    string dbFieldDesc = "Description" + locale;

    var sql = $"UPDATE EncyclopediaEntity SET OriginalEntryId = @originalId, {dbFieldTitle} = @title, {dbFieldDesc} = @description WHERE Id = @id";
    ExecuteSqlCommand(connectionString, sql, ent.Id.ToString(), originalId, title, description);

    ent.GetType().GetProperty(dbFieldTitle).SetValue(ent, title, null);
    ent.GetType().GetProperty(dbFieldDesc).SetValue(ent, description, null);
}

private void ExecuteSqlCommand(string connectionString, string sql, string id, string originalId, string title, string description)
{
    using (SqlConnection conn = new SqlConnection(connectionString))
    {
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.Parameters.AddWithValue("@id", id);
        cmd.Parameters.AddWithValue("@originalId", string.IsNullOrEmpty(originalId) ? DBNull.Value.ToString() : originalId);
        cmd.Parameters.AddWithValue("@title", title);
        cmd.Parameters.AddWithValue("@description", description);

        int rowsAffected = cmd.ExecuteNonQuery();
        if (rowsAffected == 0) 
        {
            Console.WriteLine($"ERROR!");
        }
    }
}

private string[] ParseFileName(string filePath)
{
    var withoutPath = Path.GetFileName(filePath);
    var withoutExtension = Path.ChangeExtension(withoutPath, null);
    return withoutExtension.Split("--");
}

private string GetOriginalIdFromLast12digits(string lastDigits, List<EncyclopediaEntity> entities)
{
    var entity = entities.FirstOrDefault(it => it.Id.ToString().Split("-").Last() == lastDigits);
    return entity == null ? null : entity.Id.ToString();
}

private Guid GenerateGuid(string id)
{
    var guidArray = Guid.NewGuid().ToString().Split('-');
    guidArray[4] = id;
    return new Guid(string.Join('-', guidArray));
}

private string EncodeTitle(string title)
{
    return title.Replace("&bs", "/").Replace("&gt", ">").Replace("&lt", "<").Replace("&qm", "?").Replace("&d", ":").Replace("&q", "\"");
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

private void DebugWriteEncyclopediaEntity(EncyclopediaEntity ent)
{
    DebugWrite($"{ent.Id.ToString().PadRight(36)}  ");
    DebugWrite($"{ent.OriginalEntryId.ToString().PadRight(36)}  ");
    DebugWrite($"{ent.TitleBgBg} | ");
    DebugWrite($"{ent.TitleEn} | ");
    DebugWrite($"{ent.TitleEnUs} | ");
    DebugWriteLine($"{ent.TitleUkUa}");
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
