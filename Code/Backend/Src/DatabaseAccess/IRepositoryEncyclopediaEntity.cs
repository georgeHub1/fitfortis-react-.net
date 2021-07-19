using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Entities;

namespace Backend.DatabaseAccess
{
    public interface IRepositoryEncyclopediaEntity : IGenericRepository<EncyclopediaEntity, Guid>
    {
        IQueryable<EncyclopediaEntity> SearchEncyclopedia(string searchKey);
        string SynonymIsPresent(List<string> synonyms);
        EncyclopediaEntity GetByTitle(string title);
        string UpsertBodySystem(ref int idCounter, List<string> items);
        string UpsertTitle(ref int idCounter, string title, string description, string bodySystemId);
        IQueryable<EncyclopediaEntity> GetSynonymsEntities(string id);

        Dictionary<Guid, string> GetDiagnoses(IEnumerable<Guid> ids, string langguage);
        Dictionary<Guid, IEnumerable<string>> GetSynonyms(string langguage);
        Dictionary<Guid, Tuple<string, string>> GetDiagnosesExtended(IEnumerable<Guid> ids, string langguage);
    }
}
