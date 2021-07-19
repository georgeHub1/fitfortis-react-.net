using System;

namespace Backend.Utility
{
    /// <seealso cref="System.Attribute" />
    public class AttributeBindingMember : Attribute
    {
        /// <summary>
        /// The name
        /// </summary>
        public readonly string Name;

        /// <summary>
        /// Initializes a new instance of the <see cref="AttributeBindingMember"/> class.
        /// </summary>
        /// <param name="name">The name.</param>
        public AttributeBindingMember(string name) { Name = name; }
    }


}

