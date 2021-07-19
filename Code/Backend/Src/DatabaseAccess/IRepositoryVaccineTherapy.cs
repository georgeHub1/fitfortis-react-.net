using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryVaccineTherapy : IGenericRepository<VaccineTherapy, Guid>
    {
        IQueryable<VaccineTherapy> GeVaccineTherapies();
    }
}
