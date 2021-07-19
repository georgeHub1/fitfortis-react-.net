using System.Diagnostics.CodeAnalysis;
using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    [ExcludeFromCodeCoverage]
    public class ModelPaging: BaseEntityModel
    {
        /// <summary>
        /// Gets or sets the page.
        /// </summary>
        /// <value>
        /// The page.
        /// </value>
        [AttributeBindingMember("startitem")]
        public int? StartItem { get; set; }
        /// <summary>
        /// Gets or sets the limit.
        /// </summary>
        /// <value>
        /// The limit.
        /// </value>
        [AttributeBindingMember("maxitems")]
        public int? MaxItems { get; set; }
    }
}
