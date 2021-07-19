using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedDrugTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Drug",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TitleEn = table.Column<string>(nullable: true),
                    TitleEnUs = table.Column<string>(nullable: true),
                    TitleUkUa = table.Column<string>(nullable: true),
                    TitleBgBg = table.Column<string>(nullable: true),
                    DescriptionEn = table.Column<string>(nullable: true),
                    DescriptionEnUs = table.Column<string>(nullable: true),
                    DescriptionUkUa = table.Column<string>(nullable: true),
                    DescriptionBgBg = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drug", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Drug");
        }
    }
}
