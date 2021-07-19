using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Runtime.Serialization;
using System.Security.Permissions;
using Backend.Utility;

namespace Backend.Exceptions
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    /// <seealso cref="System.Exception" />
    [ExcludeFromCodeCoverage]
    [Serializable]
    public class WrongQueryParametersException : Exception
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="WrongQueryParametersException"/> class.
        /// </summary>
        public WrongQueryParametersException()
        {
            ErrorMessages = new List<string>();
        }
        /// <summary>
        /// Initializes a new instance of the <see cref="WrongQueryParametersException"/> class.
        /// </summary>
        /// <param name="code">The code.</param>
        public WrongQueryParametersException(OperationErrorType code)
        {
            Code = code;
            ErrorMessages = new List<string>();

        }

        /// <summary>
        /// Initializes a new instance of the <see cref="WrongQueryParametersException"/> class.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <param name="errorMessages">The error messages.</param>
        /// <param name="field">The field name</param>
        public WrongQueryParametersException(OperationErrorType code, IEnumerable<string> errorMessages, string field)
        {
            Code = code;
            ErrorMessages = errorMessages.ToList();
            Field = field;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="WrongQueryParametersException"/> class.
        /// </summary>
        /// <param name="code">The code.</param>
        /// <param name="errorMessage">The error message.</param>
        public WrongQueryParametersException(OperationErrorType code, string errorMessage)
        {
            Code = code;
            ErrorMessages = new List<string> { errorMessage };
        }

        /// <summary>
        /// Gets or sets the code.
        /// </summary>
        /// <value>
        /// The code.
        /// </value>
        public OperationErrorType Code { get; set; }

        /// <summary>
        /// Gets or sets the field.
        /// </summary>
        /// <value>
        /// The field.
        /// </value>
        public string Field { get; set; }

        /// <summary>
        /// Gets or sets the error messages.
        /// </summary>
        /// <value>
        /// The error messages.
        /// </value>
        public IEnumerable<string> ErrorMessages { get; set; }

        [SecurityPermission(SecurityAction.Demand, SerializationFormatter = true)]
        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            base.GetObjectData(info, context);

            info.AddValue(nameof(Code), Code);
            info.AddValue(nameof(ErrorMessages), ErrorMessages);
        }

        public WrongQueryParametersException(string message) : base(message)
        {
        }

        public WrongQueryParametersException(string message, Exception innerException) : base(message, innerException)
        {
        }
    }
}