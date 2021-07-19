using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class ExtendedUserWithNewFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "CurrentlyPregnant",
                table: "AspNetUsers",
                nullable: true,
                oldClrType: typeof(bool),
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "HighPromiscuity",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SexualActive",
                table: "AspNetUsers",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HighPromiscuity",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "SexualActive",
                table: "AspNetUsers");

            migrationBuilder.AlterColumn<bool>(
                name: "CurrentlyPregnant",
                table: "AspNetUsers",
                nullable: true,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
