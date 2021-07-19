using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedSeederForControlCheckup : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "MinAge",
                table: "ControlCheckup",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AlterColumn<int>(
                name: "MaxAge",
                table: "ControlCheckup",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.InsertData(
                table: "ControlCheckup",
                columns: new[] { "Id", "ChronicConditions", "FamilyHistory", "FrequencyBgBg", "FrequencyEn", "FrequencyEnUs", "FrequencyUkUa", "Gender", "InactiveAt", "MaxAge", "MinAge", "ProfilacticCheckupBgBg", "ProfilacticCheckupEn", "ProfilacticCheckupEnUs", "ProfilacticCheckupUkUa", "PropertyValues", "UserProperty" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), null, null, null, "5-10 years", "5-10 years", "5-10 років", 1, null, null, 12, null, "Depression screen", "Depression screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000035"), null, null, null, "Once during pregnancy", "Once during pregnancy", "разово під час вагітності", 3, null, null, null, null, "Bacteriuria screening (12-16 week)", "Bacteriuria screening (12-16 week)", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000036"), null, null, null, "Once during pregnancy", "Once during pregnancy", "разово під час вагітності", 3, null, null, null, null, "Breastfeeding counseling (end of pregnancy)", "Breastfeeding counseling (end of pregnancy)", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000037"), null, null, null, "Once during pregnancy", "Once during pregnancy", "разово під час вагітності", 3, null, null, null, null, "Rh-incompatibility test (beginning)", "Rh-incompatibility test (beginning)", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000038"), null, null, null, "Once during pregnancy", "Once during pregnancy", "разово під час вагітності", 3, null, null, null, null, "Hepatitis B, C, HIV, syphilis screening (beginning)", "Hepatitis B, C, HIV, syphilis screening (beginning)", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000039"), null, null, null, "Multiple times during pregnancy", "Multiple times during pregnancy", "багаторазово під час вагітності", 3, null, null, null, null, "Routine checkups (once monthly (weeks 4-28); twice monthly (weeks 28-36); weekly (>36 week))", "Routine checkups (once monthly (weeks 4-28); twice monthly (weeks 28-36); weekly (>36 week))", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000040"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 3, null, 54, 40, null, "Mammogram and breast check", "Mammogram and breast check", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000034"), null, null, null, "Once during pregnancy", "Once during pregnancy", "разово під час вагітності", 3, null, null, null, null, "Gestational diabetes screen (24-28 week)", "Gestational diabetes screen (24-28 week)", null, "1", "CurrentlyPregnant" },
                    { new Guid("00000000-0000-0000-0000-000000000041"), null, null, null, "Yearly", "Yearly", "щорічно", 3, null, null, 55, null, "Mammogram and breast check", "Mammogram and breast check", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000043"), null, "00000000-0000-0000-0000-000000000021,00000000-0000-0000-0000-000000000009,00000000-0000-0000-0000-000000000022", null, "Once", "Once", "разово", 1, null, 30, 18, null, "BRCA1/BRCA2 test", "BRCA1/BRCA2 test", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000044"), "00000000-0000-0000-0000-000000000038", null, null, "Once", "Once", "разово", 1, null, 45, null, null, "BRCA1/BRCA2 test", "BRCA1/BRCA2 test", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000045"), null, null, null, "Every 15 years", "Every 15 years", "кожні 15 років", 1, null, null, 65, null, "Bone density measurement", "Bone density measurement", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000046"), null, null, null, "Once", "Once", "разово", 3, null, null, null, null, "Contraception counseling", "Contraception counseling", null, "1", "SexualActive" },
                    { new Guid("00000000-0000-0000-0000-000000000047"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 1, null, 80, 55, null, "Low-dose CT", "Low-dose CT", null, "2,3,4,5", "TobaccoConsumption" },
                    { new Guid("00000000-0000-0000-0000-000000000048"), null, null, null, "Every 5 years", "Every 5 years", "кожні 5 років", 2, null, 75, 65, null, "Ultrasound abdominal aneurism screen", "Ultrasound abdominal aneurism screen", null, "2,3,4", "TobaccoConsumption" },
                    { new Guid("00000000-0000-0000-0000-000000000042"), null, "00000000-0000-0000-0000-000000000021,00000000-0000-0000-0000-000000000009", null, "Yearly", "Yearly", "щорічно", 3, null, null, 30, null, "Mammogram and MRI", "Mammogram and MRI", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000049"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 1, null, null, 35, null, "Melanoma screen", "Melanoma screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000033"), "00000000-0000-0000-0000-000000000069", "00000000-0000-0000-0000-000000000006", null, "Every 3 years", "Every 3 years", "кожні 3 роки", 1, null, null, 50, null, "Stool-based DNA test", "Stool-based DNA test", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000031"), "00000000-0000-0000-0000-000000000069", "00000000-0000-0000-0000-000000000006", null, "Every 10 years", "Every 10 years", "кожні 10 років", 1, null, null, 50, null, "Colonoscopy", "Colonoscopy", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000002"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 1, null, null, 12, null, "General exam (including BMI, blood pressure; children - height, weight, head circumfrerence, psychologic, etc.)", "General exam (including BMI, blood pressure; children - height, weight, head circumfrerence, psychologic, etc.)", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000003"), null, null, null, "Every 5 years", "Every 5 years", "кожні 5 років", 1, null, 70, 40, null, "Diabetes type II screen and glucose tollerance", "Diabetes type II screen and glucose tollerance", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000004"), "00000000-0000-0000-0000-000000000028,00000000-0000-0000-0000-000000000071,00000000-0000-0000-0000-000000000017", null, null, "once", "Once", "разово", 1, null, null, null, null, "Aspirin consultation", "Aspirin consultation", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000005"), null, null, null, "Every 3 years", "Every 3 years", "кожні 3 роки", 3, null, 65, 12, null, "Cervical cancer screen (PAP test)", "Cervical cancer screen (PAP test)", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000006"), null, null, null, "Every 5 years", "Every 5 years", "кожні 5 років", 3, null, 65, 30, null, "HPV DNA test with PAP test", "HPV DNA test with PAP test", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000007"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 3, null, null, null, null, "Chlamydia screen, HIV-, Hepatitis B, Hepatitis C", "Chlamydia screen, HIV-, Hepatitis B, Hepatitis C", null, "1", "HighPromiscuity" },
                    { new Guid("00000000-0000-0000-0000-000000000032"), "00000000-0000-0000-0000-000000000069", "00000000-0000-0000-0000-000000000006", null, "Every 5 years", "Every 5 years", "кожні 5 років", 1, null, null, 50, null, "Virtual (CT) colonoscopy", "Virtual (CT) colonoscopy", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000008"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 3, null, 24, null, null, "Chlamydia screen", "Chlamydia screen", null, "1", "SexualActive" },
                    { new Guid("00000000-0000-0000-0000-000000000010"), "00000000-0000-0000-0000-000000000017,00000000-0000-0000-0000-000000000027,00000000-0000-0000-0000-000000000071", "00000000-0000-0000-0000-000000000003", null, "Once", "Once", "разово", 1, null, 16, 12, null, "cholesterol/lipid disorder screen", "cholesterol/lipid disorder screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000011"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 2, null, 45, 35, null, "cholesterol/lipid disorder screen", "cholesterol/lipid disorder screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000012"), "00000000-0000-0000-0000-000000000017,00000000-0000-0000-0000-000000000027,00000000-0000-0000-0000-000000000071", "00000000-0000-0000-0000-000000000003", null, "Every 2 years", "Every 2 years", "кожні 2 роки", 1, null, null, 20, null, "cholesterol/lipid disorder screen", "cholesterol/lipid disorder screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000013"), null, null, null, "Every 2 years", "Every 2 years", "кожні 2 роки", 3, null, null, 45, null, "cholesterol/lipid disorder screen", "cholesterol/lipid disorder screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000029"), "00000000-0000-0000-0000-000000000069", "00000000-0000-0000-0000-000000000006", null, "Yearly", "Yearly", "щорічно", 1, null, null, 50, null, "Fetal occult blood test", "Fetal occult blood test", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000030"), "00000000-0000-0000-0000-000000000069", "00000000-0000-0000-0000-000000000006", null, "Every 5 years", "Every 5 years", "кожні 5 років", 1, null, null, 50, null, "Sigmoidoscopy", "Sigmoidoscopy", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000009"), null, null, null, "Once", "Once", "разово", 1, null, 21, 18, null, "cholesterol/lipid disorder screen", "cholesterol/lipid disorder screen", null, null, null },
                    { new Guid("00000000-0000-0000-0000-000000000050"), null, null, null, "Yearly", "Yearly", "щорічно", 2, null, null, 45, null, "Prostate cancer screening - manual, ultrasound and optionally PSA", "Prostate cancer screening - manual, ultrasound and optionally PSA", null, null, null }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000001"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000002"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000003"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000004"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000005"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000006"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000007"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000008"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000009"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000010"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000011"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000012"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000013"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000029"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000030"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000033"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000034"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000035"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000036"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000037"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000038"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000039"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000040"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000041"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000042"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000043"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000044"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000045"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000046"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000047"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000048"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000049"));

            migrationBuilder.DeleteData(
                table: "ControlCheckup",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000050"));

            migrationBuilder.AlterColumn<int>(
                name: "MinAge",
                table: "ControlCheckup",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "MaxAge",
                table: "ControlCheckup",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
