#! /usrbin/env dotnet-script
#r "nuget: System.Data.SqlClient,4.6.0"

//--------------------------------------------------------------------------------------------------------------------------
//  
//  This script reads a set of Encyclopedia HTML files from a given directory and de-capitalizes their names. The
//  files (both renamed and untouched) are copied to a new directory.
//
//  The input files on disk are expected to have the following naming (notice how "--" are used as separators):
//      xxxxxxxxxxxx--yyyyyyyyyyyy--EnUs--Some Title.html
//  
//  This script renames them into:
//      xxxxxxxxxxxx--yyyyyyyyyyyy--EnUs--Some title.html
//
//  Notice the small "t" in "title"
//
//--------------------------------------------------------------------------------------------------------------------------

using System;
using System.Data.SqlClient;

//
// First, ensure we get the correct arguments
//
if (Args.Count != 2)
{
    DisplayUsage();
    Environment.Exit(1);
}

var dirFrom = Args[0];
var dirTo = Args[1];
if (!Directory.Exists(dirFrom)) 
{
    DisplayUsageWithError($"\"{dirFrom}\" does not exist!");
    Environment.Exit(1);
}
if (!Directory.Exists(dirTo)) 
{
    DisplayUsageWithError($"\"{dirTo}\" does not exist!");
    Environment.Exit(1);
}


//
// Second, rename the files, and copy them to the destination dir.
//
Console.WriteLine("\n\nRenaming ENCYCLOPEDIA files, to de-capitalize titles:");
Console.WriteLine($"\"{dirFrom}\" --> \"{dirTo}\"");
Console.WriteLine("(renamed files are marked with \"R\" and the unchanged files are marked with \".\")\n");

var unchangedFiles = 0;
var renamedFiles = 0;
var watch = Stopwatch.StartNew();
var processedFiles = CopyFilesWithDeCapitalizedNames(dirFrom, dirTo, ref unchangedFiles, ref renamedFiles);
watch.Stop();

Console.ForegroundColor = ConsoleColor.DarkGreen;
Console.WriteLine($"\nProcessed files: {processedFiles}");
Console.WriteLine($"Unchanged files: {unchangedFiles}");
Console.WriteLine($"Renamed files:   {renamedFiles}");
Console.WriteLine($"Processing time: {watch.Elapsed}\n");
Console.ResetColor();


private static void DisplayUsage()
{
    string scriptName = Path.GetFileName(new System.Diagnostics.StackTrace(true).GetFrame(0).GetFileName());
    Console.WriteLine($"\nUsage: dotnet script {scriptName} -- <dirFrom> <dirTo>");
    Console.WriteLine("\nDe-capitalizes the filenames of Encyclopedia files in <dirFrom> and copies the newly renamed files to <dirTo>. ");
    Console.WriteLine("For example \"000000011084--000000011082--EnUs--China Girl.html\" becomes \"000000011084--000000011082--EnUs--China girl.html\"");
}

private static void DisplayUsageWithError(string error)
{
    Console.ForegroundColor = ConsoleColor.Red;
    Console.WriteLine("ERROR: " + error);
    Console.ResetColor();
    DisplayUsage();
}

private int CopyFilesWithDeCapitalizedNames(string dirFrom, string dirTo, ref int unchangedFiles, ref int renamedFiles)
{
    var files = Directory.GetFiles(dirFrom, "*.html");
    foreach (string f in files)
    {
        // Remove the path from the filename
        string fileFrom = Path.GetFileName(f); 

        // Generate new name, then copy the file to the new dir+fname
        string fileTo = GenerateNewFileName(fileFrom);
        File.Copy(Path.Combine(dirFrom, fileFrom), Path.Combine(dirTo, fileTo));

        // Mark the file as renamed "R" or not "."
        if (fileTo == fileFrom) 
        {
            unchangedFiles++;
            Console.Write(".");
        }
        else
        {
            renamedFiles++;
            Console.Write("R");
        }
    }
    Console.WriteLine();
    return files.Length;
}

private string GenerateNewFileName(string fileFrom)
{
    // Remove extension
    var fileFromNoExt = Path.ChangeExtension(fileFrom, null);

    // Tokenize filename
    var fileParts = fileFromNoExt.Split("--");
    var id = fileParts[0];
    var origId = fileParts[1];
    var lang = fileParts[2];
    var title = fileParts[3];

    // Decapitalize the title, except first letter
    var titleNew = DecapitalizeStringExceptFirstLetter(title);

    // Generate new file name
    var newFileName = id + "--" + origId + "--" + lang + "--" + titleNew + ".html";

    return newFileName;
}

private string DecapitalizeStringExceptFirstLetter(string s1)
{
    StringBuilder sb = new StringBuilder();
    var words = s1.Split(" ");
    foreach (var w in words)
    {
        var temp = w;
        if (!IsProtectedWord(w) &&
            w[0] == char.ToUpper(w[0]) &&
            w[1] == char.ToLower(w[1])) 
        {
            // Need to fix the word. 
            temp = w.ToLower();
        }
        sb.Append(temp).Append(" ");
    }
    var s2 = sb.ToString().Trim();
    s2 = s2.First().ToString().ToUpper() + s2.Substring(1);

    return s2;
}

private bool IsProtectedWord(string word)
{
    if (word.Length < 2)               { return true; }
    if (word.Any(Char.IsDigit))        { return true; }

    // en-us
    if (word.Contains("Addison"))      { return true; }
    if (word.Contains("Alzheimer"))    { return true; }
    if (word.Contains("Asperger"))     { return true; }
    if (word.Contains("Bright"))       { return true; }
    if (word.Contains("Crohn"))        { return true; }
    if (word.Contains("Hodgkin"))      { return true; }
    if (word.Contains("Huntington"))   { return true; }
    if (word.Contains("Klinefelter"))  { return true; }
    if (word.Contains("Parkinson"))    { return true; }
    if (word.Contains("Salmonel"))     { return true; }
    if (word.Contains("Tourette"))     { return true; }
    if (word.Contains("Turner"))       { return true; }

    // bg-bg
    if (word.Contains("Адисън"))       { return true; }
    if (word.Contains("Алцхаймър"))    { return true; }
    if (word.Contains("Аспъргър"))     { return true; }
    if (word.Contains("Брайт"))        { return true; }
    if (word.Contains("Клайнфелтър"))  { return true; }
    if (word.Contains("Крон"))         { return true; }
    if (word.Contains("Ходжкин"))      { return true; }
    if (word.Contains("Хънтингтън"))   { return true; }
    if (word.Contains("Паркинсън"))    { return true; }
    if (word.Contains("Салмонел"))     { return true; }
    if (word.Contains("Турет"))        { return true; }
    if (word.Contains("Търнър"))       { return true; }

    return false;
}
