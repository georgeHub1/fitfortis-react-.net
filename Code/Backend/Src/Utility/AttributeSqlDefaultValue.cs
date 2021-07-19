using System;

namespace Backend.Utility
{
    [AttributeUsage(AttributeTargets.Property, AllowMultiple = false)]
    public class AttributeSqlDefaultValue : Attribute
    {
        public string DefaultValue { get; set; }
    }
}