# Algorithm for Encyclopedia
---

# Requirements
We need to be able to accomplish the following:

1. Be able to download all entries from the DB into HTML files.
2. Be able to upload entries from HTML files to the DB.
3. Have GUIDs that are sequential -- easy to handle by us.
4. Have GUIDs that are not easily predictable for an external user.
5. Be able to handle synonyms.

# DB Representation
In the db, every Encyclopedia item is represented as follows:

```
Id                                     OriginalEntryId                        TitleEnUs   TitleBgBg   DescriptionEnUs   DescriptionBgBg
=======================================================================================================================================
20efd35e-008e-44b6-5a65-000000000001   NULL                                   H1N1 Flu    ...         ...               ...
0280132e-29b2-46d2-5e6d-000000000002   20efd35e-008e-44b6-5a65-000000000001   Swine Flu   ...         NULL              NULL
...
```

* If an entry is an original entry, then its `OriginalEntryId` is NULL as shown in the 1st row above.
* If an entry is a synonym, then its `OriginalEntryId` points to the GUID of the original entry.


# File representation
On disk, the files are represented as follows:

```
000000000001--000000000000--EnUs--H1N1 Flu.html
000000000001--000000000000--BgBg--Грип H1N1.html
000000000002--000000000001--EnUs--Swine Flu.html
000000000002--000000000001--BgBg--Свински грип.html
...
```

Notice how...
* The format is `Id--OrigId--Lang--Title.html`
* We don't store the full GUID. Instead we only store **the last 12 digits of it**, as the IDs.
* The IDs are sequential -- 000000000001, 000000000002, etc. This makes them easy to process by a human.


# Algorithm for DOWNLOAD --- from the DB to HTML files
When we download the DB to HTML files, we use the following algorithm:

```
// Pseudocode
foreach (db entry)
{
  string id      = GetLast12Characters(dbId);
  string origId  = dbOriginalEntryId == null ? "000000000000" : GetLast12Characters(dbOriginalEntryId);

  foreach (language)
  {
    string title       = GetTitleForLanguage(language);
    string description = GetDescriptionForLanguage(language);

    if (title != null)
    {
      string filename = id + "--" + origId + "--" + language + "--" + title + ".html";
      CreateFile(filename);
      WriteDescriptionToFile(filename, description);
    }
  }
}
```

# Algorithm for UPLOAD --- from HTML files to the DB

```
// Pseudocode
foreach (file)
{
  string id          = GetIdFromFilename(file);
  string origId      = GetOrigIdFromFilename(file);
  string language    = GetLanguageFromFilename(file);
  string title       = GetTitleFromFilename(file);
  string description = GetDesriptionFromFilename(file);

  if (origId == "000000000000")
  {
    origId = null;
  }

  dbId = SearchDbForEntryWithMatchingLast12characters(id);
  if (dbId is found)
  {
    // We need to update the found entry
    // ...
  }
  else
  {
    // It's a new entry!
    dbId = GenerateGuidAndMaskLast12CharactersWithId(id);
    dbOriginalEntryId = SearchDbForEntryWithMatchingLast12characters(origId);
    UpdateDbTitleForLanguage(language, title);
    UpdateDbDescriptionForLanguage(language, description);
  }
}
```


# Why are we doing all of this?

We want to make it very easy to manage (create, review, update) content for humans. 
The only reason why we are adding the rest of the GUID is to prevent someone to go to the site, and start doing scraping like this:
```
https://fitfortis.com/encyclopedia/000000000001
https://fitfortis.com/encyclopedia/000000000002
https://fitfortis.com/encyclopedia/000000000003
...
```
With the GUID portion they won't be able to guess the GUID, because it'll look as follows:
```
https://fitfortis.com/encyclopedia/20efd35e-008e-44b6-5a65-000000000001
https://fitfortis.com/encyclopedia/802a3b20-1734-45fb-5df4-000000000002
https://fitfortis.com/encyclopedia/46490af7-7582-40f4-57da-000000000003
...
```

