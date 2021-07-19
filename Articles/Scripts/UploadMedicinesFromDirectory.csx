#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"
#define DEBUG

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
Console.WriteLine("\nDownloading MEDICINE entities from db to memory:");
var watch1 = Stopwatch.StartNew();
var medicines = GetMedicineFromDb(dbConnectionString);
var medicinesNew = new List<MedicineEntity>();
var medicinesUpdated = new List<MedicineEntity>();
watch1.Stop();
Console.WriteLine($"\nDownloaded MEDICINE entities to memory: {medicines.Count}");
Console.WriteLine($"Time for download: {watch1.Elapsed}");


//
// Third, upload the new and updated entities
//
Console.WriteLine("\n\nUploading MEDICINE entities to db:");
Console.WriteLine($"Directory: \"{directoryPath}\"");
var files = Directory.GetFiles(directoryPath);
Console.WriteLine($"Files for upload discovered: {files.Length}");
Console.WriteLine("(updated entities are marked with \".\" and new entities are marked with \"+\")");
var watch2 = Stopwatch.StartNew();
UploadFromFiles(dbConnectionString, files, medicines, medicinesUpdated, medicinesNew);
watch2.Stop();

Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.WriteLine($"Updated MEDICINE entities: {medicinesUpdated.Count}");
Console.WriteLine($"New MEDICINE entities: {medicinesNew.Count}");
Console.WriteLine($"Time for upload: {watch2.Elapsed}\n");
Console.ResetColor();


private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <username> <password> <directorypath>");
    Console.WriteLine("\nUploads all MEDICINE entries, from the HTML file into Azure Database.");
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

private List<MedicineEntity> GetMedicineFromDb(string connectionString)
{
    List<MedicineEntity> medicines = new List<MedicineEntity>();

    using (SqlConnection c = new SqlConnection(connectionString))
    {
        c.Open();
        string query = "SELECT * FROM [dbo].[EncyclopediaMedicineEntity]";
        using (SqlCommand cmd = new SqlCommand(query, c))
        {
            using (SqlDataReader r = cmd.ExecuteReader())
            {
                while (r.Read())
                {
                    medicines.Add(
                        new MedicineEntity
                        {
                            Id = new Guid(r[0].ToString()),
                            OriginalEntryId = r[11].ToString(),
                            BodySystemId = r[10].ToString(),

                            TitleBgBg = r[5].ToString(),
                            TitleEn = r[2].ToString(),
                            TitleEnUs = r[3].ToString(),
                            TitleUkUa = r[4].ToString(),

                            DescriptionBgBg = r[9].ToString(),
                            DescriptionEn = r[6].ToString(),
                            DescriptionEnUs = r[7].ToString(),
                            DescriptionUkUa = r[8].ToString(),
                        });
                    Console.Write(".");
                }
            }
        }
    }

    return medicines;
}

private void UploadFromFiles(string connectionString, string[] files, List<MedicineEntity> medicines, List<MedicineEntity> medicinesUpdated, List<MedicineEntity> medicinesNew)
{
    foreach (var file in files)
    {
        var fileElements = ParseFileName(file);
        var ent = FindMedicineEntity(fileElements[0], medicines);
        var originalId = GetOriginalIdFromLast12digits(fileElements[1], medicines);
        var locale = fileElements[2];
        var title = EncodeTitle(fileElements[3]);
        var description = File.ReadAllText(file);
        
        if (ent != null)
        {
            // An article with the same ID has been found in the MEDICINE.
            // We need to update that article
            UpdateMedicineEntity(connectionString, ent, originalId, locale, title, description);
            medicinesUpdated.Add(ent);
            Console.Write(".");
        }
        else
        {
            // This is a new article that we need to create
            ent = CreateMedicineEntity(connectionString, fileElements[0], originalId, locale, title, description);
            medicines.Add(ent);
            medicinesNew.Add(ent);
            Console.Write("+");
        }
        DebugWrite($"id:{ent.Id.ToString().PadRight(36)} ");
        DebugWrite($"origId:{(originalId != null ? originalId.PadRight(36) : " ".PadRight(36))}  ===> ");
        DebugWriteLine($"{fileElements[0]}  {fileElements[1]}  {locale}  {title} ");
    }
    Console.WriteLine();
}

private MedicineEntity FindMedicineEntity(string lastDigits, List<MedicineEntity> medicines)
{
    return medicines.FirstOrDefault(it => it.Id.ToString().Substring(24,12) == lastDigits);
}

private MedicineEntity CreateMedicineEntity(string connectionString, string id, string originalId, string locale, string title, string description)
{
    string dbFieldTitle = "Title" + locale;
    string dbFieldDesc = "Description" + locale;

    MedicineEntity ent = new MedicineEntity();
    ent.Id = GenerateGuid(id);
    ent.OriginalEntryId = originalId;
    ent.GetType().GetProperty(dbFieldTitle).SetValue(ent, title, null);
    ent.GetType().GetProperty(dbFieldDesc).SetValue(ent, description, null);

    string sql = $"INSERT INTO EncyclopediaMedicineEntity (Id, OriginalEntryId, {dbFieldTitle}, {dbFieldDesc}) Values (@id, @originalId, @title, @description)";
    ExecuteSqlCommand(connectionString, sql, ent.Id.ToString(), originalId, title, description);

    return ent;
}

private void UpdateMedicineEntity(string connectionString, MedicineEntity ent, string originalId, string locale, string title, string description)
{
    string dbFieldTitle = "Title" + locale;
    string dbFieldDesc = "Description" + locale;

    var sql = $"UPDATE EncyclopediaMedicineEntity SET OriginalEntryId = @originalId, {dbFieldTitle} = @title, {dbFieldDesc} = @description WHERE Id = @id";
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

private string GetOriginalIdFromLast12digits(string lastDigits, List<MedicineEntity> entities)
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

private void DebugWriteMedicineEntity(MedicineEntity ent)
{
    DebugWrite($"{ent.Id.ToString().PadRight(36)}  ");
    DebugWrite($"{ent.OriginalEntryId.ToString().PadRight(36)}  ");
    DebugWrite($"{ent.TitleBgBg} | ");
    DebugWrite($"{ent.TitleEn} | ");
    DebugWrite($"{ent.TitleEnUs} | ");
    DebugWriteLine($"{ent.TitleUkUa}");
}

private class MedicineEntity
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
