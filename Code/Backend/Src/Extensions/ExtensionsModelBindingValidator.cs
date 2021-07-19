using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Backend.Entities;
using Backend.Exceptions;
using Backend.Utility;

namespace Backend.Extensions
{
    public static class ExtensionsModelBindingValidator
    {
        /// <summary>
        /// Validates the querry parameter.
        /// </summary>
        /// <param name="requestParameter">The request parameter.</param>
        /// <exception cref="WrongQueryParametersException"></exception>
        public static void ValidateQueryParameter(this object requestParameter)
        {

            if (!(requestParameter is BaseEntityModel))
                throw new WrongQueryParametersException(OperationErrorType.ApiModelValidation, "Only EntityModel can be binded with querry parameters");
            var validationResults = new List<ValidationResult>();

            if (!Validator.TryValidateObject(requestParameter, new ValidationContext(requestParameter, null, null),
                validationResults, true))
            {
                if (validationResults.Any())
                    throw new WrongQueryParametersException(OperationErrorType.ApiModelValidation,
                        validationResults.Select(s => s.ErrorMessage), null);
                //else throw new WrongQueryParametersException(OperationErrorType.ApiModelValidation,
                //"Invalid querry parameters");
            }
        }
    }
}
