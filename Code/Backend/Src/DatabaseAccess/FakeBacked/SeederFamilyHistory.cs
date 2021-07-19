using System;
using Backend.Entities;
using Backend.Utility;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess.FakeBacked
{
    public static class SeederFamilyHistory
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FamilyHistory>().HasData(new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000001"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000065"), HealthIndexAmount = 2 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000002"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000110"), HealthIndexAmount = 2 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000003"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000140"), HealthIndexAmount = 4 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000004"), Category = HistoryCategory.General, EncyclopediaId = new Guid("667fe927-8c24-4b3b-b4df-000000000608"), HealthIndexAmount = 1 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000005"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000063"), HealthIndexAmount = 2 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000006"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000109"), HealthIndexAmount = 2 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000007"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000143"), HealthIndexAmount = 1 },
                new FamilyHistory {Id = new Guid("00000000-0000-0000-0000-000000000008"), Category = HistoryCategory.General, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000087"), HealthIndexAmount = 3 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000009"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000144"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000010"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000076"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000011"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000120"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000012"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000082"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000013"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000081"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000014"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000227"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000015"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000212"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000016"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000053"), HealthIndexAmount = 0 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000017"), Category = HistoryCategory.PsychiatricDisorders, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000116"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000019"), Category = HistoryCategory.PsychiatricDisorders, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000118"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000020"), Category = HistoryCategory.PsychiatricDisorders, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000148"), HealthIndexAmount = 2 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000021"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000149"), HealthIndexAmount = 2 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000022"), Category = HistoryCategory.Cancer, EncyclopediaId = new Guid("8d55f4fe-8346-4705-ad1c-000000006783"), HealthIndexAmount = 1 },
                new FamilyHistory { Id = new Guid("00000000-0000-0000-0000-000000000023"), Category = HistoryCategory.PsychiatricDisorders, EncyclopediaId = new Guid("70f4b785-e6b6-4a24-9dcf-000000001276"), HealthIndexAmount = 2 });

        }
    }
}
