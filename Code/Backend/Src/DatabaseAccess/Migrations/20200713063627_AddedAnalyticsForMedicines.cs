using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedAnalyticsForMedicines : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Analytic",
                columns: new[] { "Id", "CategoryBgBg", "CategoryEn", "CategoryEnUs", "CategoryUkUa", "InactiveAt", "NameBgBg", "NameEn", "NameEnUs", "NameUkUa", "SqlQuery" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000029"), "Енциклопедия", "Encyclopedia", "Encyclopedia", "Енциклопедія", null, "Лекарства (всі)", "Medicines (all)", "Medicines (all)", "Ліки (всі)", "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaMedicineEntity]" },
                    { new Guid("00000000-0000-0000-0000-000000000030"), "Енциклопедия", "Encyclopedia", "Encyclopedia", "Енциклопедія", null, "Лекарства (en)", "Medicines (en)", "Medicines (en)", "Ліки (en)", "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleEn IS NOT null" },
                    { new Guid("00000000-0000-0000-0000-000000000031"), "Енциклопедия", "Encyclopedia", "Encyclopedia", "Енциклопедія", null, "Лекарства (en-us)", "Medicines (en-us)", "Medicines (en-us)", "Ліки (en-us)", "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleEnUs IS NOT null" },
                    { new Guid("00000000-0000-0000-0000-000000000032"), "Енциклопедия", "Encyclopedia", "Encyclopedia", "Енциклопедія", null, "Лекарства (bg-bg)", "Medicines (bg-bg)", "Medicines (bg-bg)", "Ліки (bg-bg)", "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleBgBg IS NOT null" },
                    { new Guid("00000000-0000-0000-0000-000000000033"), "Енциклопедия", "Encyclopedia", "Encyclopedia", "Енциклопедія", null, "Лекарства (uk-ua)", "Medicines (uk-ua)", "Medicines (uk-ua)", "Ліки (uk-ua)", "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleUkUa IS NOT null" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Analytic",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000029"));

            migrationBuilder.DeleteData(
                table: "Analytic",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000030"));

            migrationBuilder.DeleteData(
                table: "Analytic",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                table: "Analytic",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                table: "Analytic",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000033"));
        }
    }
}
