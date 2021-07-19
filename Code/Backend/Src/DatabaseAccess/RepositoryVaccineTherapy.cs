using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryVaccineTherapy : RepositoryGeneric<VaccineTherapy, Guid>, IRepositoryVaccineTherapy
    {
        public RepositoryVaccineTherapy(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<VaccineTherapy> GeVaccineTherapies()
        {
            return Table.Include(it => it.Encyclopedia);
        }
    }
}
