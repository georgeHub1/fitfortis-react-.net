using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryUserVaccineTherapy : RepositoryGeneric<UserVaccineTherapy, Guid>, IRepositoryUserVaccineTherapy
    {
        public RepositoryUserVaccineTherapy(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<UserVaccineTherapy> GetUserVaccineAndTherapies(Guid userId)
        {
            return Table.Where(it => it.UserId == userId);
        }

        public IQueryable<UserVaccineTherapy> GetUserVaccineTherapiesByIds(Guid userId, IEnumerable<Guid> ids)
        {
            return Table.Where(it => it.UserId == userId && ids.Contains(it.VaccineTherapyId));
        }
    }
}
