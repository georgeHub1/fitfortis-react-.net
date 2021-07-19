using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositorySymptomChecker : RepositoryGeneric<SymptomChecker, Guid>, IRepositorySymptomChecker
    {
        public RepositorySymptomChecker(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<SymptomChecker> GetAllItemsWithRelatiom()
        {
            return Table.Include(it => it.Diagnosis);
        }

        public IQueryable<SymptomChecker> GetSymptomsForEncyclopedia(Guid encyclopediaId)
        {
            return Table.Include(it => it.EncyclopediaEntrySymptomId).Where(it => it.EncyclopediaEntryPossibleCauseOrDiagnosisId == encyclopediaId);
        }
    }
}
