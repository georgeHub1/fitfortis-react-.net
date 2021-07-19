using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositorySymptomChecker : IGenericRepository<SymptomChecker, Guid>
    {
        IQueryable<SymptomChecker> GetAllItemsWithRelatiom();
        IQueryable<SymptomChecker> GetSymptomsForEncyclopedia(Guid encyclopediaId);
    }
}