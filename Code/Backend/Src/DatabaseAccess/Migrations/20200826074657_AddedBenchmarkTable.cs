using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedBenchmarkTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BenchmarkResult",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Method = table.Column<string>(nullable: true),
                    Mean = table.Column<double>(nullable: false),
                    StdError = table.Column<double>(nullable: false),
                    StdDev = table.Column<double>(nullable: false),
                    Min = table.Column<double>(nullable: false),
                    Q1 = table.Column<double>(nullable: false),
                    Median = table.Column<double>(nullable: false),
                    Q3 = table.Column<double>(nullable: false),
                    Max = table.Column<double>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenchmarkResult", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BenchmarkResult");
        }
    }
}
