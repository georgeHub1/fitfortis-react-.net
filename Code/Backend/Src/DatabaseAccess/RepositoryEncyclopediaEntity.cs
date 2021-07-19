using System;
using System.Collections.Generic;
using System.Linq;
using Backend.Configuration;
using Backend.Entities;
using Backend.Extensions;

namespace Backend.DatabaseAccess
{
    public class RepositoryEncyclopediaEntity : RepositoryGeneric<EncyclopediaEntity, Guid>, IRepositoryEncyclopediaEntity
    {
        public RepositoryEncyclopediaEntity(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<EncyclopediaEntity> SearchEncyclopedia(string searchKey)
        {
            return Table.Where(it => it.TitleEnUs.Contains(searchKey) 
                                     || it.TitleBgBg.Contains(searchKey) 
                                     || it.TitleUkUa.Contains(searchKey));
        }

        public string SynonymIsPresent(List<string> synonyms)
        {
            return Table.FirstOrDefault(it => synonyms.Contains(it.TitleEnUs))?.Id.ToString();
        }

        public EncyclopediaEntity GetByTitle(string title)
        {
            return Table.FirstOrDefault(it => it.TitleEnUs == title);
        }

        public string UpsertBodySystem(ref int idCounter, List<string> items)
        {
            string idString = null;
            foreach (var item in items.Where(it => !string.IsNullOrEmpty(it)))
            {
                
                var entity = Table.FirstOrDefault(it => it.TitleEnUs == item) ?? Create(new EncyclopediaEntity
                {
                    Id = Guid.NewGuid().GenerateGuid(idCounter),
                    TitleEnUs = item
                });

                Save();

                idString += $"{entity.Id}, ";

                idCounter++;
            }

            return idString;
        }

        public string UpsertTitle(ref int idCounter, string title, string description, string bodySystemId)
        {
            var entity = new EncyclopediaEntity
            {
                Id = Guid.NewGuid().GenerateGuid(idCounter),
                TitleEnUs = title,
                DescriptionEnUs = description,
                BodySystemId = bodySystemId
            };

            Create(entity);
            Save();
            idCounter++;

            return entity.Id.ToString();
        }

        public IQueryable<EncyclopediaEntity> GetSynonymsEntities(string id)
        {
            return Table.Where(it => it.OriginalEntryId == id);
        }

        public Dictionary<Guid, string> GetDiagnoses(IEnumerable<Guid> ids, string langguage)
        {
            if (langguage.ToLowerInvariant() == Constants.Usa)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new {it.Id, Title = it.TitleEnUs}).ToDictionary(it => it.Id, it => it.Title);
            }

            if (langguage.ToLowerInvariant() == Constants.International)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleEn }).ToDictionary(it => it.Id, it => it.Title);
            }

            if (langguage.ToLowerInvariant() == Constants.Ukraine)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleUkUa }).ToDictionary(it => it.Id, it => it.Title);
            }

            if (langguage.ToLowerInvariant() == Constants.Bulgaria)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleBgBg }).ToDictionary(it => it.Id, it => it.Title);
            }

            return new Dictionary<Guid, string>();
        }

        public Dictionary<Guid, Tuple<string, string>> GetDiagnosesExtended(IEnumerable<Guid> ids, string langguage)
        {
            if (langguage.ToLowerInvariant() == Constants.Usa)
            {
                return  Table.Where(it => ids.Contains(it.Id)).Select(it => new {it.Id, Title = it.TitleEnUs, Description = it.DescriptionEnUs} ).ToDictionary(it => it.Id, it => new Tuple<string, string>(it.Title, it.Description));
            }

            if (langguage.ToLowerInvariant() == Constants.International)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleEn, Description = it.DescriptionEn }).ToDictionary(it => it.Id, it => new Tuple<string, string>(it.Title, it.Description));
            }

            if (langguage.ToLowerInvariant() == Constants.Ukraine)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleUkUa, Description = it.DescriptionUkUa }).ToDictionary(it => it.Id, it => new Tuple<string, string>(it.Title, it.Description));
            }

            if (langguage.ToLowerInvariant() == Constants.Bulgaria)
            {
                return Table.Where(it => ids.Contains(it.Id)).Select(it => new { it.Id, Title = it.TitleBgBg, Description = it.DescriptionBgBg }).ToDictionary(it => it.Id, it => new Tuple<string, string>(it.Title, it.Description));
            }

            return new Dictionary<Guid, Tuple<string, string>>();
        }

        public Dictionary<Guid, IEnumerable<string>> GetSynonyms(string langguage)
        {
            if (langguage.ToLowerInvariant() == Constants.Usa)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.OriginalEntryId)).GroupBy(it => it.OriginalEntryId).ToDictionary(it => new Guid(it.Key), it => it.Select(t => t.TitleEnUs));
            }

            if (langguage.ToLowerInvariant() == Constants.International)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.OriginalEntryId)).GroupBy(it => it.OriginalEntryId).ToDictionary(it => new Guid(it.Key), it => it.Select(t => t.TitleEn));
            }

            if (langguage.ToLowerInvariant() == Constants.Ukraine)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.OriginalEntryId)).GroupBy(it => it.OriginalEntryId).ToDictionary(it => new Guid(it.Key), it => it.Select(t => t.TitleUkUa));
            }

            if (langguage.ToLowerInvariant() == Constants.Bulgaria)
            {
                return Table.Where(it => !string.IsNullOrEmpty(it.OriginalEntryId)).GroupBy(it => it.OriginalEntryId).ToDictionary(it => new Guid(it.Key), it => it.Select(t => t.TitleBgBg));
            }

            return new Dictionary<Guid, IEnumerable<string>>();
        }
    }
}
