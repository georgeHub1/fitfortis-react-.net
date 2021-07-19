using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryChart : IGenericRepository<FitFortisChart, Guid>
    {
        IQueryable<FitFortisChart> GetChartsForUser(Guid userId);
    }
}
