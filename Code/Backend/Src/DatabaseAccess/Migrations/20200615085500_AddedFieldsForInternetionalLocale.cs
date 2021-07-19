using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedFieldsForInternetionalLocale : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "News",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitEn",
                table: "Metric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UnitEnConversionToSi",
                table: "Metric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEn",
                table: "EncyclopediaEntity",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "EncyclopediaEntity",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CategoryEn",
                table: "Analytic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameEn",
                table: "Analytic",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MessageEn",
                table: "Alert",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "News");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "News");

            migrationBuilder.DropColumn(
                name: "UnitEn",
                table: "Metric");

            migrationBuilder.DropColumn(
                name: "UnitEnConversionToSi",
                table: "Metric");

            migrationBuilder.DropColumn(
                name: "DescriptionEn",
                table: "EncyclopediaEntity");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "EncyclopediaEntity");

            migrationBuilder.DropColumn(
                name: "CategoryEn",
                table: "Analytic");

            migrationBuilder.DropColumn(
                name: "NameEn",
                table: "Analytic");

            migrationBuilder.DropColumn(
                name: "MessageEn",
                table: "Alert");
        }
    }
}
