using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class ChangedDrugsToMedicines : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_Drug",
                table: "Drug");

            migrationBuilder.RenameTable(
                name: "Drug",
                newName: "EncyclopediaMedicineEntity");

            migrationBuilder.AddColumn<string>(
                name: "BodySystemId",
                table: "EncyclopediaMedicineEntity",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OriginalEntryId",
                table: "EncyclopediaMedicineEntity",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EncyclopediaMedicineEntity",
                table: "EncyclopediaMedicineEntity",
                column: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EncyclopediaMedicineEntity",
                table: "EncyclopediaMedicineEntity");

            migrationBuilder.DropColumn(
                name: "BodySystemId",
                table: "EncyclopediaMedicineEntity");

            migrationBuilder.DropColumn(
                name: "OriginalEntryId",
                table: "EncyclopediaMedicineEntity");

            migrationBuilder.RenameTable(
                name: "EncyclopediaMedicineEntity",
                newName: "Drug");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Drug",
                table: "Drug",
                column: "Id");
        }
    }
}
