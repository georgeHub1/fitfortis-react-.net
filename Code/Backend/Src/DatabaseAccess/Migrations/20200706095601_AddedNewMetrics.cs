using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class AddedNewMetrics : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Metric",
                columns: new[] { "Id", "Code", "ConversionType", "DefaultAreaFillOpacity", "DefaultBackgroundColor", "DefaultBackgroundImage", "DefaultGoal", "DefaultGoalMax", "DefaultGoalMin", "DefaultStroke", "DefaultYMax", "DefaultYMin", "EncyclopediaId", "InactiveAt", "Type", "UnitBgBg", "UnitBgBgConversionToSi", "UnitEn", "UnitEnConversionToSi", "UnitEnUs", "UnitEnUsConversionToSi", "UnitSi", "UnitUkUa", "UnitUkUaConversionToSi" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000025"), "Non-HDL cholesterol", 1, "0.2", null, null, null, 130f, null, "#722ED1", null, null, new Guid("bfebe005-04fc-4ffa-a8e4-000000009582"), null, 2, "mmol/L", "1", "mg/dL", "0.0555", "mg/dL", "0.0555", "mmol/L", "мг/дл", "0.0555" },
                    { new Guid("00000000-0000-0000-0000-000000000052"), "Mean RBC iron concentration (MCHC)", 1, "0.2", null, null, null, 36f, 32f, "#722ED1", null, null, new Guid("2d825e7a-d13c-4ccb-8aef-000000011279"), null, 2, "g/dL", "10", "g/dL", "10", "g/dL", "10", "g/L", "g/dL", "10" },
                    { new Guid("00000000-0000-0000-0000-000000000051"), "Mean RBC iron (MCH)", 1, "0.2", null, null, null, 33f, 27f, "#722ED1", null, null, new Guid("0cee22f2-90da-45b8-b5e0-000000011276"), null, 2, "pg", "1", "pg", "1", "pg", "1", "pg", "pg", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000050"), "Mean RBC volume (MCV)", 1, "0.2", null, null, null, 100f, 80f, "#722ED1", null, null, new Guid("c578d319-d56e-48a7-9eaf-000000011275"), null, 2, "fL", "1", "fL", "1", "fL", "1", "fL", "fL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000049"), "Basophil count, absolute", 1, "0.2", null, null, null, 200f, 0f, "#722ED1", null, null, new Guid("7be2a744-938e-41c8-aba4-000000011259"), null, 2, "cells/µL", "1", "cells/µL", "1", "cells/µL", "1", "cells/µL", "cells/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000048"), "Eosinophil count, absolute", 1, "0.2", null, null, null, 500f, 15f, "#722ED1", null, null, new Guid("914190e6-da67-4857-ba38-000000011258"), null, 2, "cells/µL", "1", "cells/µL", "1", "cells/µL", "1", "cells/µL", "cells/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000047"), "Monocyte count, absolute", 1, "0.2", null, null, null, 950f, 200f, "#722ED1", null, null, new Guid("6dd63601-73c3-4a02-b970-000000011257"), null, 2, "cells/µL", "1", "cells/µL", "1", "cells/µL", "1", "cells/µL", "cells/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000046"), "Lymphocyte count, absolute", 1, "0.2", null, null, null, 3900f, 850f, "#722ED1", null, null, new Guid("51ca65ae-ec19-4401-9527-000000011251"), null, 2, "cells/µL", "1", "cells/µL", "1", "cells/µL", "1", "cells/µL", "cells/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000045"), "Neutrophil count, absolute", 1, "0.2", null, null, null, 7800f, 1500f, "#722ED1", null, null, new Guid("e7081c58-9b44-41ea-99df-000000001397"), null, 2, "cells/µL", "1", "cells/µL", "1", "cells/µL", "1", "cells/µL", "cells/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000044"), "Platelets", 1, "0.2", null, null, null, 400f, 140f, "#722ED1", null, null, new Guid("68a70f3d-05ee-483a-ab9c-000000001401"), null, 2, "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "thousand/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000043"), "RBC", 1, "0.2", null, null, null, 5.8f, 4f, "#722ED1", null, null, new Guid("f2cf0070-d89d-44bf-85b5-000000001398"), null, 2, "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "thousand/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000042"), "WBC", 1, "0.2", null, null, null, 10.8f, 3.8f, "#722ED1", null, null, new Guid("f586b7ca-adea-45bf-8d90-000000001396"), null, 2, "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "1", "thousand/µL", "thousand/µL", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000041"), "Hematocrit (Hct)", 1, "0.2", null, null, null, 50f, 38f, "#722ED1", null, null, new Guid("cd67cdaa-3fb3-49fa-bd23-000000009878"), null, 2, "%", "1", "%", "1", "%", "1", "%", "%", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000040"), "Hemoglobin (Hb)", 1, "0.2", null, null, null, 17.1f, 13.2f, "#722ED1", null, null, new Guid("d6294076-bca1-45be-a7d4-000000009884"), null, 2, "g/dL", "10", "g/dL", "10", "g/dL", "10", "g/L", "g/dL", "10" },
                    { new Guid("00000000-0000-0000-0000-000000000039"), "AST, GOT", 1, "0.2", null, null, null, 40f, 10f, "#722ED1", null, null, new Guid("c3e49b97-8eb6-4e0d-a269-000000004071"), null, 2, "U/L", "0.0167", "U/L", "0.0167", "U/L", "0.0167", "µkat/L", "U/L", "0.0167" },
                    { new Guid("00000000-0000-0000-0000-000000000038"), "Lactate dehydrogenase (LDH, total)", 1, "0.2", null, null, null, 280f, 140f, "#722ED1", null, null, new Guid("4372dcc8-af1e-4347-8fec-000000010481"), null, 2, "U/L", "0.0167", "U/L", "0.0167", "U/L", "0.0167", "µkat/L", "U/L", "0.0167" },
                    { new Guid("00000000-0000-0000-0000-000000000037"), "Alkaline phosphatase (AP)", 1, "0.2", null, null, null, 130f, 36f, "#722ED1", null, null, new Guid("3ccd9064-93a0-411c-a21b-000000010066"), null, 2, "U/L", "0.0167", "U/L", "0.0167", "U/L", "0.0167", "µkat/L", "U/L", "0.0167" },
                    { new Guid("00000000-0000-0000-0000-000000000036"), "Bilirubin (total)", 1, "0.2", null, null, null, 1.2f, 0.2f, "#722ED1", null, null, new Guid("9c799dc4-1aa9-4a85-a7d8-000000004674"), null, 2, "µmol/L", "1", "mg/dL", "17.104", "mg/dL", "17.104", "µmol/L", "мг/дл", "17.104" },
                    { new Guid("00000000-0000-0000-0000-000000000035"), "Globulin (blood)", 1, "0.2", null, null, null, 5.1f, 3.6f, "#722ED1", null, null, new Guid("e9e98c5b-0fba-4784-a8eb-000000009842"), null, 2, "g/dL", "10", "g/dL", "10", "g/dL", "10", "g/L", "g/dL", "10" },
                    { new Guid("00000000-0000-0000-0000-000000000034"), "Total protein (blood)", 1, "0.2", null, null, null, 8.1f, 6.1f, "#722ED1", null, null, new Guid("afb991ea-3f5b-4db8-be39-000000009844"), null, 2, "g/dL", "10", "g/dL", "10", "g/dL", "10", "g/L", "g/dL", "10" },
                    { new Guid("00000000-0000-0000-0000-000000000033"), "Calcium (blood)", 1, "0.2", null, null, null, 10.3f, 8.6f, "#722ED1", null, null, new Guid("166e232e-a4f1-4fec-b00a-000000009617"), null, 2, "mmol/L", "1", "mmol/L", "1", "mmol/L", "1", "mmol/L", "mmol/L", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000032"), "Chloride (blood)", 1, "0.2", null, null, null, 110f, 98f, "#722ED1", null, null, new Guid("9d929bac-05e6-4efd-a38b-000000009675"), null, 2, "mmol/L", "1", "mmol/L", "1", "mmol/L", "1", "mmol/L", "mmol/L", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000031"), "Potassium (blood)", 1, "0.2", null, null, null, 5.3f, 3.5f, "#722ED1", null, null, new Guid("adc5c7a6-3bce-4350-a085-000000010221"), null, 2, "mmol/L", "1", "mmol/L", "1", "mmol/L", "1", "mmol/L", "mmol/L", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000030"), "Sodium (blood)", 1, "0.2", null, null, null, 146f, 135f, "#722ED1", null, null, new Guid("24f2ef2f-2373-4702-8c27-000000010321"), null, 2, "mmol/L", "1", "mmol/L", "1", "mmol/L", "1", "mmol/L", "mmol/L", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000029"), "eGFR", 1, "0.2", null, null, null, null, 60f, "#722ED1", null, null, new Guid("753cfe34-3110-4cac-ba3d-000000004034"), null, 2, "ml/min/1.73m2", "1", "ml/min/1.73m2", "1", "ml/min/1.73m2", "1", "ml/min/1.73m2", "ml/min/1.73m2", "1" },
                    { new Guid("00000000-0000-0000-0000-000000000028"), "BUN (blood urea nitrogen)", 1, "0.2", null, null, null, 25f, 7f, "#722ED1", null, null, new Guid("c8a0f11a-67a5-4237-a372-000000009581"), null, 2, "mmol/L", "1", "mg/dL", "0.0555", "mg/dL", "0.0555", "mmol/L", "мг/дл", "0.0555" },
                    { new Guid("00000000-0000-0000-0000-000000000027"), "Triglycerides", 1, "0.2", null, null, null, 150f, null, "#722ED1", null, null, new Guid("85c89921-80e9-4e97-8314-000000008310"), null, 2, "mmol/L", "1", "mg/dL", "0.0555", "mg/dL", "0.0555", "mmol/L", "мг/дл", "0.0555" },
                    { new Guid("00000000-0000-0000-0000-000000000026"), "Cholesterol (total)", 1, "0.2", null, null, null, 200f, null, "#722ED1", null, null, new Guid("8fd1c6da-3942-4b6b-bfe8-000000000073"), null, 2, "mmol/L", "1", "mg/dL", "0.0555", "mg/dL", "0.0555", "mmol/L", "мг/дл", "0.0555" },
                    { new Guid("00000000-0000-0000-0000-000000000053"), "Uric acid (blood)", 1, "0.2", null, null, null, 8f, 4f, "#722ED1", null, null, new Guid("0df5be63-df25-4b8c-9216-000000010402"), null, 2, "mmol/L", "1", "mg/dL", "0.0595", "mg/dL", "0.0595", "mmol/L", "mg/dL", "0.0595" },
                    { new Guid("00000000-0000-0000-0000-000000000054"), "hs-CRP (high sensitivity CRP)", 1, "0.2", null, null, null, 1f, null, "#722ED1", null, null, new Guid("2d825e7a-d13c-4ccb-8aef-000000011279"), null, 2, "mg/L", "1", "mg/L", "1", "mg/L", "1", "mg/L", "mg/L", "1" }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000025"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000026"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000027"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000028"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000029"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000030"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000031"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000032"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000033"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000034"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000035"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000036"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000037"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000038"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000039"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000040"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000041"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000042"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000043"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000044"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000045"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000046"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000047"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000048"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000049"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000050"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000051"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000052"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000053"));

            migrationBuilder.DeleteData(
                table: "Metric",
                keyColumn: "Id",
                keyValue: new Guid("00000000-0000-0000-0000-000000000054"));
        }
    }
}
