using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;

namespace Backend.ModelService
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    /// <seealso cref="BaseEntityModel" />
    public class ModelValidationError : BaseEntityModel
    {
        /// <summary>
        /// Gets or sets the message.
        /// </summary>
        /// <value>
        /// The message.
        /// </value>
        public string Message { get; set; }
        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>
        /// The code.
        /// </value>
        [JsonConverter(typeof(ErrorCodeConverter))]
        public OperationErrorType Code { get; set; }
        /// <summary>
        /// Gets or sets the field.
        /// </summary>
        /// <value>
        /// The field.
        /// </value>
        public string Field { get; set; }
    }
}