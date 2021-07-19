using System;
using System.Data.SqlClient;
using BenchmarkDotNet.Mathematics;
using BenchmarkDotNet.Running;

namespace Benchmark
{
    public class Program
    {
        static void Main(string[] args)
        {
            var location = args.Length > 0 ? args[0] : "Default";
            var r = BenchmarkRunner.Run<ResponseBenchmarks>();

            foreach (var benchmarkReport in r.Reports)
            {
                SaveBenchmarkResult(location, benchmarkReport.BenchmarkCase.DisplayInfo, benchmarkReport.ResultStatistics);
            }
        }

        private static void SaveBenchmarkResult(string location, string method, Statistics report)
        {
            string connectionString = @"Server=tcp:fitfortis.database.windows.net,1433;Initial Catalog=FitFortis;Persist Security Info=False;User ID=FitFortis_admin;Password=ZRiE238pZBCqdGn;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;";
            //string connectionString = @"Server=.\SQLEXPRESS;Database=FitFortis;Trusted_Connection=True;Integrated Security=SSPI;Connection Timeout=30;";

            string command = $"Insert into BenchmarkResult (Id, Method, Mean, StdError, StdDev, Min, Q1, Median, Q3, Max, Date, Location)" +
                             "Values (@id, @method, @mean, @error, @dev, @min, @q1, @median, @q3, @max, @date, @location)";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                conn.Open();
                SqlCommand cmd = new SqlCommand(command, conn);
                cmd.Parameters.AddWithValue("@id", Guid.NewGuid());
                cmd.Parameters.AddWithValue("@method", method);
                cmd.Parameters.AddWithValue("@mean", report.Mean);
                cmd.Parameters.AddWithValue("@error", report.StandardError);
                cmd.Parameters.AddWithValue("@dev", report.StandardDeviation);
                cmd.Parameters.AddWithValue("@min", report.Min);
                cmd.Parameters.AddWithValue("@q1", report.Q1);
                cmd.Parameters.AddWithValue("@median", report.Median);
                cmd.Parameters.AddWithValue("@q3", report.Q3);
                cmd.Parameters.AddWithValue("@max", report.Max);
                cmd.Parameters.AddWithValue("@date", DateTime.UtcNow);
                cmd.Parameters.AddWithValue("@location", location ?? string.Empty);


                int rowsAffected = cmd.ExecuteNonQuery();
                if (rowsAffected == 0)
                {
                    Console.WriteLine($"ERROR!");
                }
            }
        }
    }
}
