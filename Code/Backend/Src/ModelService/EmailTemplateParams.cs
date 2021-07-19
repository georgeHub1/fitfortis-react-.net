using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Backend.Entities;

namespace Backend.ModelService
{
    public class EmailTemplateParams : BaseEntity
    {
        public Dictionary<string, string> PropertiesDictionary { get; set; }

        public EmailTemplateParams(object entityObject)
        {
            PropertiesDictionary = GetPropertiesDictionary(entityObject);
        }

        private Dictionary<string, string> GetPropertiesDictionary(object entityObject)
        {
            return entityObject.GetType().GetProperties(
                BindingFlags.Instance | BindingFlags.Public).ToDictionary(prop => $"-{prop.Name}-", prop => prop.GetValue(entityObject, null) != null
                ? prop.GetValue(entityObject, null).ToString() : string.Empty);
        }


        //public EmailTemplateParams()
        //{
        //	PropertiesDictionary = new Dictionary<string, string>();
        //}
        //public EmailTemplateParams(BaseEntity entityObject)
        //{
        //	PropertiesDictionary = GetPropertiesDictionary(entityObject);
        //}
        //public Dictionary<string, string> PropertiesDictionary { get; set; }

        //private Dictionary<string, string> GetPropertiesDictionary(BaseEntity entityObject)
        //{
        //	return entityObject.GetType().GetProperties(
        //			BindingFlags.Instance | BindingFlags.Public).ToDictionary(prop => $"-{prop.Name}-", prop => prop.GetValue(entityObject, null) != null
        //			? prop.GetValue(entityObject, null).ToString() : string.Empty);
        //}
    }
}