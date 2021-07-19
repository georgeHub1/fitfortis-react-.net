using System;
using System.Collections.Specialized;
using System.Linq;
using System.Reflection;
using System.Web;
using Backend.Entities;

namespace Backend.Extensions
{
    public static class ExtensionBaseEntity
    {
        public static void MapChanges(this BaseEntity entity, object data)
        {
            if (data == null)
            {
                throw new ArgumentNullException(nameof(data));
            }

            foreach (var propertyInfo in data.GetType().GetProperties(BindingFlags.FlattenHierarchy |
                                                                      BindingFlags.Instance |
                                                                      BindingFlags.Public))
            {
                var val = propertyInfo.GetValue(data);
                if (val != null)
                {
                    var correspondingProperty = entity.GetType().GetProperty(propertyInfo.Name);
                    try
                    {
                        correspondingProperty?.SetValue(entity, val, null);
                    }
                    catch (Exception)
                    {
                        // ignored
                    }
                }
            }
        }

        //It works only with objects that has all nullable properties
        public static bool HasInitializedProperty(this BaseEntity entity)
        {
            var type = entity.GetType();
            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            return properties.Select(x => x.GetValue(entity, null)).Any(y => !string.IsNullOrWhiteSpace(y?.ToString())
            && y.GetType() != typeof(bool));
        }

        //It works only with objects that has all nullable properties
        public static NameValueCollection GetPropertiesList(this Object entity)
        {
            var type = entity.GetType();
            var properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
            var entityFields = HttpUtility.ParseQueryString(string.Empty);
            foreach (var prp in properties)
            {
                var value = prp.GetValue(entity, null);
                if (value != null)
                    entityFields.Add(prp.Name, value.ToString());
            }
            return entityFields;
        }

        public static string GetPropertyValue(this object entity, string propertyName)
        {
            return entity?.GetType().GetProperty(propertyName)?.GetValue(entity, null)?.ToString();
        }
    }
}