using System.Diagnostics.CodeAnalysis;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class ModelSorting: BaseEntityModel
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="ModelSorting"/> is asc.
        /// </summary>
        /// <value>as
        ///   <c>true</c> if asc; otherwise, <c>false</c>.
        /// </value>
        [AttributeBindingMember("asc")]
        public bool? Asc { get; set; }
        /// <summary>
        /// Gets or sets the field.
        /// </summary>
        /// <value>
        /// The field.
        /// </value>
        [AttributeBindingMember("sort")]
        public string Field { get; set; }
    }
}
