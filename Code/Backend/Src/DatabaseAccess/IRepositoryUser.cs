using System;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryUser : IGenericRepository<User, Guid>
    {
        User GetUserByEmail(string email);
    }
}
