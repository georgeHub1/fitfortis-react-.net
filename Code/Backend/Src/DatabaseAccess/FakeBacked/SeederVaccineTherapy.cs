using System;
using Backend.Entities;
using Backend.Utility;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess.FakeBacked
{
    public static class SeederVaccineTherapy
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<VaccineTherapy>().HasData(new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000001"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000163"), HealthIndexAmount = -0.5f},
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000002"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000164"), HealthIndexAmount = -1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000003"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000165"), HealthIndexAmount = -1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000004"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000166"), HealthIndexAmount = -0.5f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000005"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000167"), HealthIndexAmount = -0.5f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000006"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000168"), HealthIndexAmount = -0.3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000007"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000169"), HealthIndexAmount = -1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000008"), Category = VaccineCategory.Childhood, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000170"), HealthIndexAmount = -1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000009"), Category = VaccineCategory.Childhood, Recomended = true, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000171"), HealthIndexAmount = -0.5f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000010"), Category = VaccineCategory.Adult, Recomended = true, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000172"), HealthIndexAmount = -1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000011"), Category = VaccineCategory.Adult, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000173"), HealthIndexAmount = -0.3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000012"), Category = VaccineCategory.Adult, EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000174"), HealthIndexAmount = -0.3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000013"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000150"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -4f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000151"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000015"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000152"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -2f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000016"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000153"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -2f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000017"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000154"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000018"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000155"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = 1f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000019"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000156"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -3f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000021"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000158"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -2f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000022"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000159"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -2f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000023"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000160"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -2.5f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000024"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000161"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -1.5f },
                new VaccineTherapy { Id = new Guid("00000000-0000-0000-0000-000000000025"), EncyclopediaId = new Guid("00000000-0000-0000-0000-000000000162"), Category = VaccineCategory.LongTermTherapy, HealthIndexAmount = -3f }
                );
        }
    }
}
