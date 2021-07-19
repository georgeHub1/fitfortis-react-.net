using System;
using System.Linq;
using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.DatabaseAccess
{
    public class RepositoryUserAlert : RepositoryGeneric<UserAlert, Guid>, IRepositoryUserAlert
    {
        public RepositoryUserAlert(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<UserAlert> GetUserAlertsByAlertId(Guid alertId)
        {
            return Table.Where(it => it.AlertId == alertId);
        }

        public IQueryable<UserAlert> GetAlertsForUser(Guid userId)
        {
            return Table.Include(it => it.Alert).Where(it => it.UserId == userId);
        }
    }
}
