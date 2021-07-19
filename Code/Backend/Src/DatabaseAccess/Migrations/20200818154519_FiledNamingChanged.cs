using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class FiledNamingChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentlyPregnant",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "Pregnancy",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Pregnancy",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "CurrentlyPregnant",
                table: "AspNetUsers",
                nullable: true);
        }
    }
}
