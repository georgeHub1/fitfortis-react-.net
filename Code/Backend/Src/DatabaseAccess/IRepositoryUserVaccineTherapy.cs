using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryUserVaccineTherapy : IGenericRepository<UserVaccineTherapy, Guid>
    {
        IQueryable<UserVaccineTherapy> GetUserVaccineAndTherapies(Guid userId);
        IQueryable<UserVaccineTherapy> GetUserVaccineTherapiesByIds(Guid userId, IEnumerable<Guid> ids);
    }
}
