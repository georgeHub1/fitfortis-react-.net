using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedFieldsToMetricData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "DoctorVisitComments",
                table: "MetricData",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LabResultsComments",
                table: "MetricData",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DoctorVisitComments",
                table: "MetricData");

            migrationBuilder.DropColumn(
                name: "LabResultsComments",
                table: "MetricData");
        }
    }
}
