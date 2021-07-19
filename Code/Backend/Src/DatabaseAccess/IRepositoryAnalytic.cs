using System;
using System.Linq;
using Backend.Entities;
using Backend.ModelService;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryAnalytic : IGenericRepository<Analytic, Guid>
    {
        QueryResult RunAnalytic(Guid id);
    }
}
