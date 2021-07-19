using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.DatabaseAccess.FakeBacked;
using Backend.Entities;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Storage;

namespace Backend.DatabaseAccess
{
    public class DatabaseContext : IdentityDbContext<User, Role, Guid>, IUnitOfWork
    {
        private readonly IHttpContextAccessor _httpContextAccessor;


        public DatabaseContext(DbContextOptions<DatabaseContext> options, IHttpContextAccessor httpContextAccessor) : base(options)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public DbQuery<QueryResult> QueryResult { get; set; }

        #region Db Set

        public DbSet<Alert> Alert { get; set; }
        public DbSet<UserAlert> AlertAspNetUser { get; set; }
        public DbSet<Analytic> Analytic { get; set; }
        public DbSet<AnalyticData> AnalyticData { get; set; }
        public DbSet<Audit> Audit { get; set; }
        public DbSet<BenchmarkResult> BenchmarkResult { get; set; }
        public DbSet<FitFortisChart> Chart { get; set; }
        public DbSet<ChartMetric> ChartMetric { get; set; }
        public DbSet<ControlCheckup> ControlCheckup { get; set; }
        public DbSet<ChronicCondition> ChronicCondition { get; set; }
        public DbSet<Document> Document { get; set; }
        public DbSet<EncyclopediaEntity> EncyclopediaEntity { get; set; }
        public DbSet<Drug> EncyclopediaMedicineEntity { get; set; }
        public DbSet<ExceptionLog> ExceptionLog { get; set; }
        public DbSet<FamilyHistory> FamilyHistory { get; set; }
        public DbSet<Metric> Metric { get; set; }
        public DbSet<MetricData> MetricData { get; set; }
        public DbSet<News> News { get; set; }
        public DbSet<NewsLikesAndComments> NewsLikesAndComments { get; set; }
        public DbSet<SearchRequest> SearchRequest { get; set; }
        public DbSet<SymptomChecker> SymptomChecker { get; set; }
        public DbSet<VaccineTherapy> VaccineTherapy { get; set; }
        public DbSet<UserVaccineTherapy> VaccineTherapyAspNetUser { get; set; }
        public DbSet<UserCondition> ChronicConditionAspNetUser { get; set; }
        public DbSet<UserFamilyHistory> FamilyHistoryAspNetUser { get; set; }
        public DbSet<AnalyticUserSignIn> AnalyticUserSignIn { get; set; }
        


        #endregion

        public new EntityEntry<TEntity> Entry<TEntity>(TEntity entity) where TEntity : class
        {
            return base.Entry(entity);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            SeedData(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<ChartMetric>()
                .HasIndex(it => new {it.ChartId, it.MetricId})
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasQueryFilter(p => p.InactiveAt == null);

            // Encryption attribute applying
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                foreach (var property in entityType.GetProperties())
                {
                    var attributes = property.PropertyInfo.GetCustomAttributes(typeof(AttributeEncrypted), false);
                    if (attributes.Any())
                    {
                        property.SetValueConverter(new ConverterEncrypted());
                    }
                }
            }
        }

        public override int SaveChanges()
        {
            // resolving optimistic concurrency exceptions (client wins)
            // https://msdn.microsoft.com/en-in/data/jj592904.aspx
            var conflict = false;
            var retryCount = Constants.DbConcurrencyResolveRetryLimit;
            var res = 0;
            do
            {
                try
                {
                    conflict = false;
                    var auditEntries = OnBeforeSaveChanges();
                    res = base.SaveChanges();
                    OnAfterSaveChanges(auditEntries);

                }
                catch (DbUpdateConcurrencyException ex)
                {
                    conflict = --retryCount > 0;
                    if (conflict)
                    {
                        // Update original values from the database (client wins)
                        var entry = ex.Entries.Single();
                        entry.OriginalValues.SetValues(entry.GetDatabaseValues());
                    }
                    else
                    {
                        throw; // give up :-(
                    }
                }
            } while (conflict);

            return res;
        }

        private Guid UserId
        {
            get
            {
                var userIdClaim = _httpContextAccessor.HttpContext.User.FindFirst(x => x.Type == ClaimTypes.NameIdentifier);
                if (userIdClaim != null)
                {
                    if (Guid.TryParse(userIdClaim.Value, out var userId))
                    {
                        return userId;
                    }
                }

                return Guid.Empty;
            }
        }

        public async Task CreateOrMigrateAsync(bool clean = false)
        {
            if (clean)
            {
                await Database.EnsureDeletedAsync().ConfigureAwait(false);
            }
            else
            {
                await Database.MigrateAsync().ConfigureAwait(false);
            }
        }

        public IDbContextTransaction BeginTransaction()
        {
            return Database.BeginTransaction();
        }

        public void Commit(IDbContextTransaction transaction)
        {
            transaction.Commit();
        }

        public QueryResult RunRawSql(string query)
        {
            return QueryResult.FromSql(query).FirstOrDefault();
        }

        public void Rollback(IDbContextTransaction transaction)
        {
            transaction.Rollback();
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            SeederEncyclopedia.SeedData(modelBuilder);
            SeederSymptomChecker.SeedData(modelBuilder);
            SeederMetric.SeedData(modelBuilder);
            SeederFamilyHistory.SeedData(modelBuilder);
            SeederChronicConndition.SeedData(modelBuilder);
            SeederVaccineTherapy.SeedData(modelBuilder);
            SeederAnalytic.SeedData(modelBuilder);
            SeederCheckup.SeedData(modelBuilder);
        }

        private List<AuditEntry> OnBeforeSaveChanges()
        {
            ChangeTracker.DetectChanges();

            var auditEntries = new List<AuditEntry>();

            foreach (var entityEntry in ChangeTracker.Entries())
            {
                if (entityEntry.Entity is Audit || entityEntry.Entity is ExceptionLog || entityEntry.State == EntityState.Detached || entityEntry.State == EntityState.Unchanged)
                {
                    continue;
                }

                var auditEntry = new AuditEntry(entityEntry)
                {
                    TableName = entityEntry.Metadata.Relational().TableName,
                    UserId = UserId == Guid.Empty ? (Guid?) null : UserId
                };

                auditEntries.Add(auditEntry);

                foreach (var property in entityEntry.Properties)
                {
                    if (property.IsTemporary)
                    {
                        auditEntry.TemporaryProperties.Add(property);
                        continue;
                    }

                    string propertyName = property.Metadata.Name;
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[propertyName] = property.CurrentValue;
                        continue;
                    }

                    switch (entityEntry.State)
                    {
                        case EntityState.Added:
                            auditEntry.NewValues[propertyName] = property.CurrentValue;
                            auditEntry.Action = Constants.Insert;
                            break;
                        case EntityState.Deleted:
                            auditEntry.OldValues[propertyName] = property.OriginalValue;
                            auditEntry.Action = Constants.Delete;
                            break;
                        case EntityState.Modified:
                            if (property.IsModified)
                            {
                                auditEntry.OldValues[propertyName] = property.OriginalValue;
                                auditEntry.NewValues[propertyName] = property.CurrentValue;
                                auditEntry.Action = Constants.Update;
                            }

                            break;
                    }
                }
            }

            foreach (var auditEntry in auditEntries.Where(it => !it.HasTemporaryProperties))
            {
                Audit.Add(auditEntry.ToAudit());
            }

            return auditEntries.Where(it => it.HasTemporaryProperties).ToList();
        }

        private Task OnAfterSaveChanges(List<AuditEntry> auditEntries)
        {
            if (auditEntries == null || auditEntries.Count == 0)
            {
                return Task.CompletedTask;
            }

            foreach (var auditEntry in auditEntries)
            {
                foreach (var property in auditEntry.TemporaryProperties)
                {
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[property.Metadata.Name] = property.CurrentValue;
                    }
                    else
                    {
                        auditEntry.NewValues[property.Metadata.Name] = property.CurrentValue;
                    }
                }

                Audit.Add(auditEntry.ToAudit());
            }

            return SaveChangesAsync();
        }
    }
}
