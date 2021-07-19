using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedControlCheckupTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ControlCheckup",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FrequencyEnUs = table.Column<string>(nullable: true),
                    FrequencyEn = table.Column<string>(nullable: true),
                    FrequencyUkUa = table.Column<string>(nullable: true),
                    FrequencyBgBg = table.Column<string>(nullable: true),
                    ProfilacticCheckupEnUs = table.Column<string>(nullable: true),
                    ProfilacticCheckupEn = table.Column<string>(nullable: true),
                    ProfilacticCheckupUkUa = table.Column<string>(nullable: true),
                    ProfilacticCheckupBgBg = table.Column<string>(nullable: true),
                    MinAge = table.Column<int>(nullable: false),
                    MaxAge = table.Column<int>(nullable: false),
                    ChronicConditions = table.Column<string>(nullable: true),
                    FamilyHistory = table.Column<string>(nullable: true),
                    PropertyValues = table.Column<string>(nullable: true),
                    UserProperty = table.Column<string>(nullable: true),
                    Gender = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ControlCheckup", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ControlCheckup");
        }
    }
}
