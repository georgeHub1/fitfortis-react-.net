using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class SeedMetricsWithNewLocale : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "IU/L", "0.0167" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "g/dL", "10" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "mm Hg", "0.133" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "mm Hg", "0.133" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "kg/m2", "1" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "°C", "C" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "mg/dL", "0.0555" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "bpm", "0.133" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000012"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "cm", "0.01" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000013"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "cm", "0.01" });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000015"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { "kg", "1" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000012"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000013"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });

            migrationBuilder.UpdateData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000015"),
                columns: new[] { "UnitEn", "UnitEnConversionToSi" },
                values: new object[] { null, null });
        }
    }
}
