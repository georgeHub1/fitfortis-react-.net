#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"

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

var arguments = Args.ToArray();
var dbUsername = Args[0];
var dbPassword = Args[1];
var directoryPath = Args[2];
if (!Directory.Exists(directoryPath)) 
{
    DisplayUsageWithError($"The directory \"{directoryPath}\" does not exist!");
    Environment.Exit(1);
}


//
// Second, download the DB in memory
//
Console.WriteLine("\nReading Medicine entities from db:");
var watch1 = Stopwatch.StartNew();
var medicine = GetMedicinesFromDb(dbUsername, dbPassword);
watch1.Stop();
Console.WriteLine($"Downloaded Medicine entities to memory: {medicine.Count}");
Console.WriteLine($"Time for download: {watch1.Elapsed}");


//
// Third, write the HTML files
//
Console.WriteLine("\nWriting Medicine entities to HTML files:");
var watch2 = Stopwatch.StartNew();
FileCounts fc = WriteFiles(medicine, directoryPath);
watch2.Stop();
Console.WriteLine($"Writen HTML files: {fc.All}");
Console.WriteLine($"Time for write: {watch2.Elapsed}");

Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.WriteLine($"\nDownloaded Medicine entities to memory: {medicine.Count}");
Console.WriteLine($"Time for download: {watch1.Elapsed}");
Console.WriteLine($"\nWriten HTML files: {fc.All}");
Console.WriteLine($"By locale...");
Console.WriteLine($"            BgBg : {fc.BgBg}");
Console.WriteLine($"            En   : {fc.En}");
Console.WriteLine($"            EnUs : {fc.EnUs}");
Console.WriteLine($"            UkUa : {fc.UkUa}");
Console.WriteLine($"Time for write: {watch2.Elapsed}");
Console.ResetColor();



private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <username> <password> <directorypath>\n");
    Console.WriteLine("Downloads all Medicine entries, from the db in Azure, to a directory.");
    Console.WriteLine("Every entry is downloaded as a separate HTML file.");
}

private static void DisplayUsageWithError(string error)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("\nERROR: " + error);
    Console.ResetColor();
    DisplayUsage();
}

private List<MedicineEntity> GetMedicinesFromDb(string dbUserName, string dbPassword)
{
    List<MedicineEntity> medicines = new List<MedicineEntity>();

    SqlConnectionStringBuilder b = new SqlConnectionStringBuilder();
    b.DataSource = "tcp:fitfortis.database.windows.net,1433";
    b.InitialCatalog = "FitFortis";
    b.UserID = dbUserName;
    b.Password = dbPassword;

    using (SqlConnection c = new SqlConnection(b.ConnectionString))
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
                        //
                        //  IMPORTANT: Verify relative position of the field!
                        //
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
                Console.WriteLine();
            }
        }
    }

    return medicines;
}

private FileCounts WriteFiles(List<MedicineEntity> entities, string path)
{
    FileCounts fc = new FileCounts();
    foreach (var ent in entities)
    {
        if (!string.IsNullOrEmpty(ent.TitleBgBg)) { GenerateFile(path, ent.Id, ent.OriginalEntryId, "BgBg", ent.TitleBgBg, ent.DescriptionBgBg); fc.All++; fc.BgBg++; }
        if (!string.IsNullOrEmpty(ent.TitleEn))   { GenerateFile(path, ent.Id, ent.OriginalEntryId, "En",   ent.TitleEn,   ent.DescriptionEn);   fc.All++; fc.En++; }
        if (!string.IsNullOrEmpty(ent.TitleEnUs)) { GenerateFile(path, ent.Id, ent.OriginalEntryId, "EnUs", ent.TitleEnUs, ent.DescriptionEnUs); fc.All++; fc.EnUs++; }
        if (!string.IsNullOrEmpty(ent.TitleUkUa)) { GenerateFile(path, ent.Id, ent.OriginalEntryId, "UkUa", ent.TitleUkUa, ent.DescriptionUkUa); fc.All++; fc.UkUa++; }

        Console.Write(".");
    }

    Console.WriteLine();
    return fc;
}

private void GenerateFile(string path, Guid id, string originalId, string lang, string title, string description)
{
    var miniId = id.GetLastPart();
    var miniOrigId = !string.IsNullOrEmpty(originalId)
        ? originalId.Split('-').Last()
        : 0.ToString("D12");

    using (FileStream fs = new FileStream(GenerateFilePath(path, miniId, miniOrigId, lang, title), FileMode.Create))
    {
        using (StreamWriter w = new StreamWriter(fs, Encoding.UTF8))
        {
            w.Write(description);
        }
    }
}

private string GenerateFilePath(string rootPath, string id, string originalId, string locale, string title)
{
    var validTitle = title.Replace("/", "&bs").Replace(">", "&gt").Replace("<", "&lt").Replace("?", "&qm").Replace(":", "&d").Replace("\"", "&q");
    return Path.Combine(rootPath, $"{id}--{originalId}--{locale}--{validTitle}.html");
}

public static string GetLastPart(this Guid id)
{
    var guidArray = id.ToString().Split('-');
    return guidArray.Last();
}

private class MedicineEntity
{
    public Guid Id { get; set; }
    public string OriginalEntryId { get; set; }
    public string BodySystemId { get; set; }

    public string TitleBgBg { get; set; }
    public string TitleEn   { get; set; }   // English (International)
    public string TitleEnUs { get; set; }
    public string TitleUkUa { get; set; }

    public string DescriptionBgBg { get; set; }
    public string DescriptionEn   { get; set; }   // English (International)
    public string DescriptionEnUs { get; set; }
    public string DescriptionUkUa { get; set; }
}

private struct FileCounts
{
    public int All   { get; set; }

    public int BgBg  { get; set; }
    public int En    { get; set; }
    public int EnUs  { get; set; }
    public int UkUa  { get; set; }
}
