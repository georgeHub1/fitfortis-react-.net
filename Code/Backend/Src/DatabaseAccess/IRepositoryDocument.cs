using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryDocument : IGenericRepository<Document, Guid>
    {
        IQueryable<Document> GetUserDocuments(Guid userId);
        IQueryable<Document> GetInactiveDocuments(Guid userId);
    }
}