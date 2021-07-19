using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Backend.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Alert",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MessageEnUs = table.Column<string>(nullable: true),
                    MessageUkUa = table.Column<string>(nullable: true),
                    MessageBgBg = table.Column<string>(nullable: true),
                    CreationDate = table.Column<DateTime>(nullable: false),
                    ExecutionDate = table.Column<DateTime>(nullable: false),
                    Type = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Alert", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Analytic",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CategoryBgBg = table.Column<string>(nullable: true),
                    NameBgBg = table.Column<string>(nullable: true),
                    CategoryEnUs = table.Column<string>(nullable: true),
                    NameEnUs = table.Column<string>(nullable: true),
                    CategoryUkUa = table.Column<string>(nullable: true),
                    NameUkUa = table.Column<string>(nullable: true),
                    SqlQuery = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Analytic", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Name = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedName = table.Column<string>(maxLength: 256, nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    EmailConfirmed = table.Column<bool>(nullable: false),
                    PasswordHash = table.Column<string>(nullable: true),
                    SecurityStamp = table.Column<string>(nullable: true),
                    ConcurrencyStamp = table.Column<string>(nullable: true),
                    PhoneNumber = table.Column<string>(nullable: true),
                    PhoneNumberConfirmed = table.Column<bool>(nullable: false),
                    TwoFactorEnabled = table.Column<bool>(nullable: false),
                    LockoutEnd = table.Column<DateTimeOffset>(nullable: true),
                    LockoutEnabled = table.Column<bool>(nullable: false),
                    AccessFailedCount = table.Column<int>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 128, nullable: false),
                    LastName = table.Column<string>(maxLength: 128, nullable: false),
                    UserName = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedUserName = table.Column<string>(maxLength: 256, nullable: true),
                    Email = table.Column<string>(maxLength: 256, nullable: true),
                    NormalizedEmail = table.Column<string>(maxLength: 256, nullable: true),
                    DateOfBirth = table.Column<DateTime>(nullable: true),
                    SexAtBirth = table.Column<int>(nullable: true),
                    GenderIdentity = table.Column<int>(nullable: true),
                    EthnicOrigin = table.Column<int>(nullable: true),
                    Language = table.Column<string>(nullable: true),
                    Diet = table.Column<int>(nullable: true),
                    Sports = table.Column<int>(nullable: true),
                    Alcohol = table.Column<int>(nullable: true),
                    TobaccoConsumption = table.Column<int>(nullable: true),
                    QuitDate = table.Column<DateTime>(nullable: true),
                    BiologicalChildren = table.Column<int>(nullable: false),
                    NonBiologicalChildren = table.Column<int>(nullable: false),
                    CurrentlyPregnant = table.Column<bool>(nullable: true),
                    PregnantDueDate = table.Column<DateTime>(nullable: true),
                    FirstPregnancyDate = table.Column<DateTime>(nullable: true),
                    LastPregnancy = table.Column<DateTime>(nullable: true),
                    AvatarId = table.Column<Guid>(nullable: true),
                    CreateAccountDate = table.Column<DateTime>(nullable: false),
                    EmailConfirmedDate = table.Column<DateTime>(nullable: true),
                    BloodGroup = table.Column<int>(nullable: true),
                    RhFactor = table.Column<int>(nullable: true),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUsers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EncyclopediaEntity",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    OriginalEntryId = table.Column<string>(nullable: true),
                    BodySystemId = table.Column<string>(nullable: true),
                    TitleEnUs = table.Column<string>(nullable: true),
                    TitleUkUa = table.Column<string>(nullable: true),
                    TitleBgBg = table.Column<string>(nullable: true),
                    DescriptionEnUs = table.Column<string>(nullable: true),
                    DescriptionUkUa = table.Column<string>(nullable: true),
                    DescriptionBgBg = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EncyclopediaEntity", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "News",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TitleEnUs = table.Column<string>(nullable: true),
                    TitleUkUa = table.Column<string>(nullable: true),
                    TitleBgBg = table.Column<string>(nullable: true),
                    DescriptionEnUs = table.Column<string>(nullable: true),
                    DescriptionUkUa = table.Column<string>(nullable: true),
                    DescriptionBgBg = table.Column<string>(nullable: true),
                    PictureId = table.Column<Guid>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    PictureUrl = table.Column<string>(nullable: true),
                    Language = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_News", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AnalyticData",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    AnalyticId = table.Column<Guid>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyticData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalyticData_Analytic_AnalyticId",
                        column: x => x.AnalyticId,
                        principalTable: "Analytic",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AlertAspNetUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsRead = table.Column<bool>(nullable: false),
                    Hide = table.Column<bool>(nullable: false),
                    SnoozeTill = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false),
                    AlertId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AlertAspNetUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AlertAspNetUser_Alert_AlertId",
                        column: x => x.AlertId,
                        principalTable: "Alert",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AlertAspNetUser_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AnalyticUserSignIn",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SignInDatetime = table.Column<DateTime>(nullable: true),
                    SessionDurationInSeconds = table.Column<int>(nullable: false),
                    Status = table.Column<int>(nullable: false),
                    UserAgent = table.Column<string>(nullable: true),
                    AnonymousId = table.Column<Guid>(nullable: true),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnalyticUserSignIn", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AnalyticUserSignIn_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    UserId = table.Column<Guid>(nullable: false),
                    ClaimType = table.Column<string>(nullable: true),
                    ClaimValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    LoginProvider = table.Column<string>(nullable: false),
                    ProviderKey = table.Column<string>(nullable: false),
                    ProviderDisplayName = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                    table.ForeignKey(
                        name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    RoleId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "AspNetRoles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    UserId = table.Column<Guid>(nullable: false),
                    LoginProvider = table.Column<string>(nullable: false),
                    Name = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                    table.ForeignKey(
                        name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Audit",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TableName = table.Column<string>(nullable: true),
                    ActionDate = table.Column<DateTime>(nullable: false),
                    Action = table.Column<string>(nullable: true),
                    KeyValues = table.Column<string>(nullable: true),
                    OldValues = table.Column<string>(nullable: true),
                    NewValues = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Audit_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Chart",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Name = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chart", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Chart_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Document",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FileUri = table.Column<string>(nullable: true),
                    OriginalFileName = table.Column<string>(nullable: true),
                    FileName = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ContentType = table.Column<string>(nullable: true),
                    FileSize = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    FieldId = table.Column<Guid>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Document", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Document_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ExceptionLog",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Message = table.Column<string>(nullable: true),
                    Type = table.Column<string>(nullable: true),
                    Url = table.Column<string>(nullable: true),
                    Source = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    Username = table.Column<string>(nullable: true),
                    UserId = table.Column<Guid>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExceptionLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExceptionLog_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SearchRequest",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    SearchText = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    SearchArea = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: true),
                    LinkedEntityId = table.Column<Guid>(nullable: true),
                    IsSuccessful = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchRequest", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchRequest_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ChronicCondition",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Category = table.Column<int>(nullable: false),
                    GenderApplicability = table.Column<int>(nullable: true),
                    EncyclopediaId = table.Column<Guid>(nullable: false),
                    HealthIndexAmount = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicCondition", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChronicCondition_EncyclopediaEntity_EncyclopediaId",
                        column: x => x.EncyclopediaId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyHistory",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Category = table.Column<int>(nullable: false),
                    EncyclopediaId = table.Column<Guid>(nullable: false),
                    HealthIndexAmount = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyHistory", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyHistory_EncyclopediaEntity_EncyclopediaId",
                        column: x => x.EncyclopediaId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Metric",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Code = table.Column<string>(maxLength: 128, nullable: true),
                    EncyclopediaId = table.Column<Guid>(nullable: true),
                    Type = table.Column<int>(nullable: false),
                    ConversionType = table.Column<int>(nullable: false),
                    UnitSi = table.Column<string>(nullable: true),
                    UnitBgBg = table.Column<string>(maxLength: 128, nullable: true),
                    UnitEnUs = table.Column<string>(maxLength: 128, nullable: true),
                    UnitUkUa = table.Column<string>(maxLength: 128, nullable: true),
                    UnitBgBgConversionToSi = table.Column<string>(nullable: true),
                    UnitEnUsConversionToSi = table.Column<string>(nullable: true),
                    UnitUkUaConversionToSi = table.Column<string>(nullable: true),
                    DefaultYMin = table.Column<string>(maxLength: 128, nullable: true),
                    DefaultYMax = table.Column<string>(maxLength: 128, nullable: true),
                    DefaultGoal = table.Column<float>(nullable: true),
                    DefaultGoalMin = table.Column<float>(nullable: true),
                    DefaultGoalMax = table.Column<float>(nullable: true),
                    DefaultStroke = table.Column<string>(nullable: true),
                    DefaultBackgroundColor = table.Column<string>(nullable: true),
                    DefaultBackgroundImage = table.Column<string>(nullable: true),
                    DefaultAreaFillOpacity = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Metric", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Metric_EncyclopediaEntity_EncyclopediaId",
                        column: x => x.EncyclopediaId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "SymptomChecker",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    EncyclopediaEntrySymptomId = table.Column<Guid>(nullable: true),
                    EncyclopediaEntryPossibleCauseOrDiagnosisId = table.Column<Guid>(nullable: true),
                    ApplicableToMale = table.Column<bool>(nullable: false),
                    ApplicableToFemale = table.Column<bool>(nullable: false),
                    ApplicableToFemalePregnant = table.Column<bool>(nullable: false),
                    MinAgeOfApplicability = table.Column<int>(nullable: false),
                    MaxAgeOfApplicability = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SymptomChecker", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SymptomChecker_EncyclopediaEntity_EncyclopediaEntryPossibleCauseOrDiagnosisId",
                        column: x => x.EncyclopediaEntryPossibleCauseOrDiagnosisId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SymptomChecker_EncyclopediaEntity_EncyclopediaEntrySymptomId",
                        column: x => x.EncyclopediaEntrySymptomId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VaccineTherapy",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Category = table.Column<int>(nullable: false),
                    Recomended = table.Column<bool>(nullable: false),
                    EncyclopediaId = table.Column<Guid>(nullable: false),
                    HealthIndexAmount = table.Column<float>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccineTherapy", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccineTherapy_EncyclopediaEntity_EncyclopediaId",
                        column: x => x.EncyclopediaId,
                        principalTable: "EncyclopediaEntity",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NewsLikesAndComments",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Comment = table.Column<string>(nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    Type = table.Column<int>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false),
                    NewsId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsLikesAndComments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NewsLikesAndComments_News_NewsId",
                        column: x => x.NewsId,
                        principalTable: "News",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NewsLikesAndComments_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChronicConditionAspNetUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<Guid>(nullable: false),
                    ChronicConditionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChronicConditionAspNetUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChronicConditionAspNetUser_ChronicCondition_ChronicConditionId",
                        column: x => x.ChronicConditionId,
                        principalTable: "ChronicCondition",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChronicConditionAspNetUser_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyHistoryAspNetUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<Guid>(nullable: false),
                    FamilyHistoryId = table.Column<Guid>(nullable: false),
                    Date = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyHistoryAspNetUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FamilyHistoryAspNetUser_FamilyHistory_FamilyHistoryId",
                        column: x => x.FamilyHistoryId,
                        principalTable: "FamilyHistory",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyHistoryAspNetUser_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ChartMetric",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ShowGoalLines = table.Column<bool>(nullable: false),
                    AnnotateLastEntry = table.Column<bool>(nullable: false),
                    AnnotateMaxEntry = table.Column<bool>(nullable: false),
                    AnnotateMinEntry = table.Column<bool>(nullable: false),
                    BackgroundColor = table.Column<string>(nullable: true),
                    Stroke = table.Column<string>(nullable: true),
                    YMin = table.Column<string>(nullable: true),
                    YMax = table.Column<string>(nullable: true),
                    ChartId = table.Column<Guid>(nullable: false),
                    MetricId = table.Column<Guid>(nullable: false),
                    Goal = table.Column<float>(nullable: true),
                    GoalMin = table.Column<float>(nullable: true),
                    GoalMax = table.Column<float>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChartMetric", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ChartMetric_Chart_ChartId",
                        column: x => x.ChartId,
                        principalTable: "Chart",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ChartMetric_Metric_MetricId",
                        column: x => x.MetricId,
                        principalTable: "Metric",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MetricData",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Date = table.Column<DateTime>(nullable: false),
                    Value = table.Column<float>(nullable: true),
                    RangeMin = table.Column<float>(nullable: true),
                    RangeMax = table.Column<float>(nullable: true),
                    Measurements = table.Column<float>(nullable: true),
                    DoctorVisits = table.Column<float>(nullable: true),
                    LabResults = table.Column<float>(nullable: true),
                    MetricId = table.Column<Guid>(nullable: false),
                    UserId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetricData", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MetricData_Metric_MetricId",
                        column: x => x.MetricId,
                        principalTable: "Metric",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MetricData_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VaccineTherapyAspNetUser",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    InactiveAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UserId = table.Column<Guid>(nullable: false),
                    VaccineTherapyId = table.Column<Guid>(nullable: false),
                    Date = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VaccineTherapyAspNetUser", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VaccineTherapyAspNetUser_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VaccineTherapyAspNetUser_VaccineTherapy_VaccineTherapyId",
                        column: x => x.VaccineTherapyId,
                        principalTable: "VaccineTherapy",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Analytic",
                columns: new[] { "Id", "CategoryBgBg", "CategoryEnUs", "CategoryUkUa", "InactiveAt", "NameBgBg", "NameEnUs", "NameUkUa", "SqlQuery" },
                values: new object[,]
                {
                    { new Guid("00000000-0000-0000-0000-000000000001"), "Употреба", "Usage", "Використання", null, "Потребители", "Users", "Користувачі", "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers]" },
                    { new Guid("00000000-0000-0000-0000-000000000012"), "Новини", "Newsfeed", "Новини", null, "Статии (с харесвания)", "Articles (with likes)", "Статті (з вподобанням)", "SELECT COUNT (*) AS Value FROM [dbo].[NewsLikesAndComments]" },
                    { new Guid("00000000-0000-0000-0000-000000000011"), "Употреба", "Usage", "Використання", null, "ПАП (почасово активни потребители)", "HAU (hourly active users)", "АКГ (активні корситувачі за годину)", "SELECT COUNT (*) AS Value FROM (Select Distinct UserId FROM [dbo].[AnalyticUserSignIn] WHERE SignInDatetime > DATEADD(HOUR, -1, GETDATE())) AS LOGINS" },
                    { new Guid("00000000-0000-0000-0000-000000000010"), "Употреба", "Usage", "Використання", null, "ЕАП (ежедневно активни потребители)", "DAU (daily active users)", "АКД (активні корситувачі за день)", "SELECT COUNT (*) AS Value FROM (Select Distinct UserId FROM [dbo].[AnalyticUserSignIn] WHERE CAST(SignInDatetime as date) = CAST(getdate() as date)) AS LOGINS" },
                    { new Guid("00000000-0000-0000-0000-000000000009"), "Табло", "Dashboard", "Панель", null, "Метрика", "Metrics", "Метрики", "SELECT COUNT (*) AS Value FROM [dbo].[Metric]" },
                    { new Guid("00000000-0000-0000-0000-000000000008"), "Енциклопедия", "Encyclopedia", "Енциклопедія", null, "Оригинални записи", "Original entries", "Оригінальні записи", "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaEntity] WHERE (OriginalEntryId is NULL or OriginalEntryId = '')" },
                    { new Guid("00000000-0000-0000-0000-000000000013"), "Енциклопедия", "Encyclopedia", "Енциклопедія", null, "Все записи", "All entries", "Всі записи", "SELECT COUNT (*) AS Value FROM [dbo].[EncyclopediaEntity]" },
                    { new Guid("00000000-0000-0000-0000-000000000006"), "Новини", "Newsfeed", "Новини", null, "Статии", "Articles", "Статті", "SELECT COUNT (*) AS Value FROM [dbo].[News]" },
                    { new Guid("00000000-0000-0000-0000-000000000005"), "Употреба", "Usage", "Використання", null, "Потребители (няма аватар)", "Users (no avatar)", "Користувачі (немає аватару)", "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE AvatarId is NUll" },
                    { new Guid("00000000-0000-0000-0000-000000000004"), "Употреба", "Usage", "Використання", null, "Потребители (няма пола по рождение)", "Users (no sex at birth)", "Користувачі (немає статі при народженні)", "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE SexAtBirth is NUll" },
                    { new Guid("00000000-0000-0000-0000-000000000003"), "Употреба", "Usage", "Використання", null, "Потребители (непотвърден имейл)", "Users (unconfirmed email)", "Користувачі (не підтвертджений емейл)", "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE EmailConfirmed = 0" },
                    { new Guid("00000000-0000-0000-0000-000000000002"), "Употреба", "Usage", "Використання", null, "Потребители (без ДР)", "Users (no DOB)", "Користувачі (без ДН)", "SELECT COUNT (*) AS Value FROM [dbo].[AspNetUsers] WHERE DateOfBirth is NULL" },
                    { new Guid("00000000-0000-0000-0000-000000000007"), "Новини", "Newsfeed", "Новини", null, "Обича", "Likes", "Вподобання", "SELECT COUNT (*) AS Value FROM (Select Distinct NewsId FROM [dbo].[NewsLikesAndComments]) AS LIKES" }
                });


            migrationBuilder.CreateIndex(
                name: "IX_AlertAspNetUser_AlertId",
                table: "AlertAspNetUser",
                column: "AlertId");

            migrationBuilder.CreateIndex(
                name: "IX_AlertAspNetUser_UserId",
                table: "AlertAspNetUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticData_AnalyticId",
                table: "AnalyticData",
                column: "AnalyticId");

            migrationBuilder.CreateIndex(
                name: "IX_AnalyticUserSignIn_UserId",
                table: "AnalyticUserSignIn",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetRoleClaims_RoleId",
                table: "AspNetRoleClaims",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "NormalizedName",
                unique: true,
                filter: "[NormalizedName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserClaims_UserId",
                table: "AspNetUserClaims",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserLogins_UserId",
                table: "AspNetUserLogins",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUserRoles_RoleId",
                table: "AspNetUserRoles",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_Email",
                table: "AspNetUsers",
                column: "Email",
                unique: true,
                filter: "[Email] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "NormalizedEmail");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "NormalizedUserName",
                unique: true,
                filter: "[NormalizedUserName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Audit_UserId",
                table: "Audit",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Chart_UserId",
                table: "Chart",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartMetric_MetricId",
                table: "ChartMetric",
                column: "MetricId");

            migrationBuilder.CreateIndex(
                name: "IX_ChartMetric_ChartId_MetricId",
                table: "ChartMetric",
                columns: new[] { "ChartId", "MetricId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ChronicCondition_EncyclopediaId",
                table: "ChronicCondition",
                column: "EncyclopediaId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronicConditionAspNetUser_ChronicConditionId",
                table: "ChronicConditionAspNetUser",
                column: "ChronicConditionId");

            migrationBuilder.CreateIndex(
                name: "IX_ChronicConditionAspNetUser_UserId",
                table: "ChronicConditionAspNetUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Document_UserId",
                table: "Document",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ExceptionLog_UserId",
                table: "ExceptionLog",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistory_EncyclopediaId",
                table: "FamilyHistory",
                column: "EncyclopediaId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistoryAspNetUser_FamilyHistoryId",
                table: "FamilyHistoryAspNetUser",
                column: "FamilyHistoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyHistoryAspNetUser_UserId",
                table: "FamilyHistoryAspNetUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Metric_EncyclopediaId",
                table: "Metric",
                column: "EncyclopediaId");

            migrationBuilder.CreateIndex(
                name: "IX_MetricData_MetricId",
                table: "MetricData",
                column: "MetricId");

            migrationBuilder.CreateIndex(
                name: "IX_MetricData_UserId",
                table: "MetricData",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsLikesAndComments_NewsId",
                table: "NewsLikesAndComments",
                column: "NewsId");

            migrationBuilder.CreateIndex(
                name: "IX_NewsLikesAndComments_UserId",
                table: "NewsLikesAndComments",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SearchRequest_UserId",
                table: "SearchRequest",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SymptomChecker_EncyclopediaEntryPossibleCauseOrDiagnosisId",
                table: "SymptomChecker",
                column: "EncyclopediaEntryPossibleCauseOrDiagnosisId");

            migrationBuilder.CreateIndex(
                name: "IX_SymptomChecker_EncyclopediaEntrySymptomId",
                table: "SymptomChecker",
                column: "EncyclopediaEntrySymptomId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccineTherapy_EncyclopediaId",
                table: "VaccineTherapy",
                column: "EncyclopediaId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccineTherapyAspNetUser_UserId",
                table: "VaccineTherapyAspNetUser",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_VaccineTherapyAspNetUser_VaccineTherapyId",
                table: "VaccineTherapyAspNetUser",
                column: "VaccineTherapyId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AlertAspNetUser");

            migrationBuilder.DropTable(
                name: "AnalyticData");

            migrationBuilder.DropTable(
                name: "AnalyticUserSignIn");

            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "Audit");

            migrationBuilder.DropTable(
                name: "ChartMetric");

            migrationBuilder.DropTable(
                name: "ChronicConditionAspNetUser");

            migrationBuilder.DropTable(
                name: "Document");

            migrationBuilder.DropTable(
                name: "ExceptionLog");

            migrationBuilder.DropTable(
                name: "FamilyHistoryAspNetUser");

            migrationBuilder.DropTable(
                name: "MetricData");

            migrationBuilder.DropTable(
                name: "NewsLikesAndComments");

            migrationBuilder.DropTable(
                name: "SearchRequest");

            migrationBuilder.DropTable(
                name: "SymptomChecker");

            migrationBuilder.DropTable(
                name: "VaccineTherapyAspNetUser");

            migrationBuilder.DropTable(
                name: "Alert");

            migrationBuilder.DropTable(
                name: "Analytic");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "Chart");

            migrationBuilder.DropTable(
                name: "ChronicCondition");

            migrationBuilder.DropTable(
                name: "FamilyHistory");

            migrationBuilder.DropTable(
                name: "Metric");

            migrationBuilder.DropTable(
                name: "News");

            migrationBuilder.DropTable(
                name: "VaccineTherapy");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropTable(
                name: "EncyclopediaEntity");
        }
    }
}
