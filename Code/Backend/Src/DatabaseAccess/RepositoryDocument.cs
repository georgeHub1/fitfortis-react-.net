using System;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public class RepositoryDocument : RepositoryGeneric<Document, Guid>, IRepositoryDocument
    {
        public RepositoryDocument(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Document> GetUserDocuments(Guid userId)
        {
            return Table.Where(it => it.UserId == userId);
        }

        public IQueryable<Document> GetInactiveDocuments(Guid userId)
        {
            return GetDbTable<Document>().Where(it => it.UserId == userId && it.InactiveAt.HasValue);
        }
    }
}