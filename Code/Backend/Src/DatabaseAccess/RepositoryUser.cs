using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryUser : RepositoryGeneric<User, Guid>, IRepositoryUser
    {
        public RepositoryUser(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public User GetUserByEmail(string email)
        {
            return Table.FirstOrDefault(x => x.Email.Equals(email, StringComparison.OrdinalIgnoreCase));
        }
    }
}