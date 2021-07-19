﻿using System;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess.FakeBacked
{
    public static class SeederAnalytic
    {
        public static void SeedData(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Analytic>().HasData(new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000001"), CategoryEnUs = "Usage", NameEnUs = "Users", CategoryBgBg = "Употреба", NameBgBg = "Потребители", CategoryUkUa = "Використання", NameUkUa = "Користувачі", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers]"},
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000002"), CategoryEnUs = "Usage", NameEnUs = "Users (no DOB)", CategoryBgBg = "Употреба", NameBgBg = "Потребители (без ДР)", CategoryUkUa = "Використання", NameUkUa = "Користувачі (без ДН)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE DateOfBirth is NULL"},
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000003"), CategoryEnUs = "Usage", NameEnUs = "Users (unconfirmed email)", CategoryBgBg = "Употреба", NameBgBg = "Потребители (непотвърден имейл)", CategoryUkUa = "Використання", NameUkUa = "Користувачі (не підтвертджений емейл)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE EmailConfirmed = 0" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000004"), CategoryEnUs = "Usage", NameEnUs = "Users (no sex at birth)", CategoryBgBg = "Употреба", NameBgBg = "Потребители (няма пола по рождение)", CategoryUkUa = "Використання", NameUkUa = "Користувачі (немає статі при народженні)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE SexAtBirth is NUll" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000005"), CategoryEnUs = "Usage", NameEnUs = "Users (no avatar)", CategoryBgBg = "Употреба", NameBgBg = "Потребители (няма аватар)", CategoryUkUa = "Використання", NameUkUa = "Користувачі (немає аватару)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE AvatarId is NUll" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000006"), CategoryEnUs = "Newsfeed", NameEnUs = "Articles", CategoryBgBg = "Новини", NameBgBg = "Статии", CategoryUkUa = "Новини", NameUkUa = "Статті", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[News]" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000007"), CategoryEnUs = "Newsfeed", NameEnUs = "Likes", CategoryBgBg = "Новини", NameBgBg = "Обича", CategoryUkUa = "Новини", NameUkUa = "Вподобання", SqlQuery = "SELECT COUNT (*) AS Value FROM (Select Distinct NewsId FROM [dbo].[NewsLikesAndComments]) AS LIKES" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000008"), CategoryEnUs = "Encyclopedia", NameEnUs = "Original entries", CategoryBgBg = "Енциклопедия", NameBgBg = "Оригинални записи", CategoryUkUa = "Енциклопедія", NameUkUa = "Оригінальні записи", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId is NULL or OriginalEntryId = '')" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000009"), CategoryEnUs = "Dashboard", NameEnUs = "Metrics", CategoryBgBg = "Табло", NameBgBg = "Метрика", CategoryUkUa = "Панель", NameUkUa = "Метрики", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[Metric]" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000010"), CategoryEnUs = "Usage", NameEnUs = "DAU (daily active users)", CategoryBgBg = "Употреба", NameBgBg = "ЕАП (ежедневно активни потребители)", CategoryUkUa = "Використання", NameUkUa = "АКД (активні корситувачі за день)", SqlQuery = "SELECT COUNT (*) AS Value FROM (Select Distinct UserId FROM [dbo].[AnalyticUserSignIn] WHERE CAST(SignInDatetime as date) = CAST(getdate() as date)) AS LOGINS" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000011"), CategoryEnUs = "Usage", NameEnUs = "HAU (hourly active users)", CategoryBgBg = "Употреба", NameBgBg = "ПАП (почасово активни потребители)", CategoryUkUa = "Використання", NameUkUa = "АКГ (активні корситувачі за годину)", SqlQuery = "SELECT COUNT (*) AS Value FROM (Select Distinct UserId FROM [dbo].[AnalyticUserSignIn] WHERE SignInDatetime > DATEADD(HOUR, -1, GETDATE())) AS LOGINS" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000012"), CategoryEnUs = "Newsfeed", NameEnUs = "Articles (with likes)", CategoryBgBg = "Новини", NameBgBg = "Статии (с харесвания)", CategoryUkUa = "Новини", NameUkUa = "Статті (з вподобанням)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[NewsLikesAndComments]" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000013"), CategoryEnUs = "Encyclopedia", NameEnUs = "All entries", CategoryBgBg = "Енциклопедия", NameBgBg = "Все записи", CategoryUkUa = "Енциклопедія", NameUkUa = "Всі записи", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaEntity]" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000029"), CategoryEn = "Encyclopedia", NameEn = "Medicines (all)", CategoryEnUs = "Encyclopedia", NameEnUs = "Medicines (all)", CategoryBgBg = "Енциклопедия", NameBgBg = "Лекарства (всі)", CategoryUkUa = "Енциклопедія", NameUkUa = "Ліки (всі)", SqlQuery = "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaMedicineEntity]" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000030"), CategoryEn = "Encyclopedia", NameEn = "Medicines (en)", CategoryEnUs = "Encyclopedia", NameEnUs = "Medicines (en)", CategoryBgBg = "Енциклопедия", NameBgBg = "Лекарства (en)", CategoryUkUa = "Енциклопедія", NameUkUa = "Ліки (en)", SqlQuery = "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleEn IS NOT null" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000031"), CategoryEn = "Encyclopedia", NameEn = "Medicines (en-us)", CategoryEnUs = "Encyclopedia", NameEnUs = "Medicines (en-us)", CategoryBgBg = "Енциклопедия", NameBgBg = "Лекарства (en-us)", CategoryUkUa = "Енциклопедія", NameUkUa = "Ліки (en-us)", SqlQuery = "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleEnUs IS NOT null" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000032"), CategoryEn = "Encyclopedia", NameEn = "Medicines (bg-bg)", CategoryEnUs = "Encyclopedia", NameEnUs = "Medicines (bg-bg)", CategoryBgBg = "Енциклопедия", NameBgBg = "Лекарства (bg-bg)", CategoryUkUa = "Енциклопедія", NameUkUa = "Ліки (bg-bg)", SqlQuery = "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleBgBg IS NOT null" },
                new Analytic { Id = new Guid("00000000-0000-0000-0000-000000000033"), CategoryEn = "Encyclopedia", NameEn = "Medicines (uk-ua)", CategoryEnUs = "Encyclopedia", NameEnUs = "Medicines (uk-ua)", CategoryBgBg = "Енциклопедия", NameBgBg = "Лекарства (uk-ua)", CategoryUkUa = "Енциклопедія", NameUkUa = "Ліки (uk-ua)", SqlQuery = "SELECT COUNT(*) AS Value FROM [dbo].[EncyclopediaMedicineEntity] WHERE TitleUkUa IS NOT null" });
                }
    }
}