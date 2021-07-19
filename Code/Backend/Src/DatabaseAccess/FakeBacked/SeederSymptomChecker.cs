using System;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess.FakeBacked
{
    public static class SeederSymptomChecker
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EncyclopediaEntity>().HasData(new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000001"), TitleEnUs = "aches"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000002"), TitleEnUs = "chills"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000003"), TitleEnUs = "cough"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000004"), TitleEnUs = "fatigue"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000005"), TitleEnUs = "fever"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000006"), TitleEnUs = "headache"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000007"), TitleEnUs = "sneezing"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000008"), TitleEnUs = "sore throat"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000009"), TitleEnUs = "stuffy nose"},
                new EncyclopediaEntity {Id = new Guid("00000000-0000-0000-0000-000000000010"), TitleEnUs = "Low Appetite" },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000011"), TitleEnUs = "FemaleDiagnosis", DescriptionEnUs = "Test description"},
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000012"), TitleEnUs = "FemalePregnantDiagnosis", DescriptionEnUs = "Test description" },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000013"), TitleEnUs = "MaleDiagnosis", DescriptionEnUs = "Test description" },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000014"), TitleEnUs = "DiagnosisTest", DescriptionEnUs = "Test description" },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000015"), TitleEnUs = "DiagnosisRange", DescriptionEnUs = "Test description" },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000016"), TitleEnUs = "Alanine transaminase", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000017"), TitleEnUs = "Albumin (serum)", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("4AD3ABDF-92F7-471C-8D41-000000000018"), TitleEnUs = "Alcohol", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000019"), TitleEnUs = "Blood pressure (diastolic)", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000020"), TitleEnUs = "Blood pressure (systolic)", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000021"), TitleEnUs = "Body mass index", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000022"), TitleEnUs = "Body temperature", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000023"), TitleEnUs = "Gamma-glutamyl transpeptidase", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000024"), TitleEnUs = "Glucose", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000025"), TitleEnUs = "Heart rate (resting)", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000026"), TitleEnUs = "Height", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000027"), TitleEnUs = "Hip circumference", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000028"), TitleEnUs = "Waist circumference", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000029"), TitleEnUs = "Waist-to-height ratio", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000030"), TitleEnUs = "Weight", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000031"), TitleEnUs = "Smoking", DescriptionEnUs = "..." },
                new EncyclopediaEntity { Id = new Guid("00000000-0000-0000-0000-000000000032"), TitleEnUs = "Timeline", DescriptionEnUs = "..." });

            modelBuilder.Entity<SymptomChecker>().HasData(
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000001"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000011"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000009"), ApplicableToFemale = true, ApplicableToFemalePregnant = false, ApplicableToMale = false, MaxAgeOfApplicability = 1000, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000002"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000011"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000008"), ApplicableToFemale = true, ApplicableToFemalePregnant = false, ApplicableToMale = false, MaxAgeOfApplicability = 1000, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000003"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000012"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000009"), ApplicableToFemale = false, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 50, MinAgeOfApplicability = 20 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000004"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000013"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000009"), ApplicableToFemale = false, ApplicableToFemalePregnant = false, ApplicableToMale = true, MaxAgeOfApplicability = 1000, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000005"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000013"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000002"), ApplicableToFemale = false, ApplicableToFemalePregnant = false, ApplicableToMale = true, MaxAgeOfApplicability = 1000, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000006"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000004"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 40, MinAgeOfApplicability = 30 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000007"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000005"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 40, MinAgeOfApplicability = 30 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000008"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000007"), ApplicableToFemale = false, ApplicableToFemalePregnant = false, ApplicableToMale = true, MaxAgeOfApplicability = 70, MinAgeOfApplicability = 20 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000009"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000008"), ApplicableToFemale = false, ApplicableToFemalePregnant = false, ApplicableToMale = true, MaxAgeOfApplicability = 70, MinAgeOfApplicability = 20 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000010"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000001"), ApplicableToFemale = false, ApplicableToFemalePregnant = false, ApplicableToMale = true, MaxAgeOfApplicability = 70, MinAgeOfApplicability = 20 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000011"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000015"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000001"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 50, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000012"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000015"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000006"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 50, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000013"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000015"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000008"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 50, MinAgeOfApplicability = 0 },
                new SymptomChecker { Id = new Guid("00000000-0000-0000-0000-000000000014"), EncyclopediaEntryPossibleCauseOrDiagnosisId = new Guid("00000000-0000-0000-0000-000000000015"), EncyclopediaEntrySymptomId = new Guid("00000000-0000-0000-0000-000000000002"), ApplicableToFemale = true, ApplicableToFemalePregnant = true, ApplicableToMale = false, MaxAgeOfApplicability = 50, MinAgeOfApplicability = 0 });
        }
    }
}
