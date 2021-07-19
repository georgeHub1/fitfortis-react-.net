using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class UpdatedMetricSeeder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Metric",
                columns: new[] { "Id", "Code", "ConversionType", "DefaultAreaFillOpacity", "DefaultBackgroundColor", "DefaultBackgroundImage", "DefaultGoal", "DefaultGoalMax", "DefaultGoalMin", "DefaultStroke", "DefaultYMax", "DefaultYMin", "EncyclopediaId", "InactiveAt", "Type", "UnitBgBg", "UnitBgBgConversionToSi", "UnitEn", "UnitEnConversionToSi", "UnitEnUs", "UnitEnUsConversionToSi", "UnitSi", "UnitUkUa", "UnitUkUaConversionToSi" },
                values: new object[] { new Guid("00000000-0000-0000-0000-000000000024"), "Stress", 0, "0.2", null, null, null, null, null, "#722ED1", null, null, new Guid("8cc94312-6f08-4915-b2fc-000000002432"), null, 3, "#", "1", "#", "1", "#", "1", "#", "#", "1" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000024"));
        }
    }
}
