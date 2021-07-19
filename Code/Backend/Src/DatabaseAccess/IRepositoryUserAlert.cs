using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryUserAlert : IGenericRepository<UserAlert, Guid>
    {
        IQueryable<UserAlert> GetUserAlertsByAlertId(Guid alertId);
        IQueryable<UserAlert> GetAlertsForUser(Guid userId);
    }
}
