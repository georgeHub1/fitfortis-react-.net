using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class FiledNaming : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SexualActive",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "SexuallyActive",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SexuallyActive",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "SexualActive",
                table: "AspNetUsers",
                nullable: true);
        }
    }
}
