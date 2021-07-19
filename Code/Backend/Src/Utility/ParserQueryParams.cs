using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using Backend.Exceptions;

namespace Backend.Utility
{
    internal abstract class ParserQueryParams
    {
        internal object ParseSingleValue(Type type, string parameter)
        {
            return TypeDescriptor.GetConverter(type).ConvertFromInvariantString(parameter);
        }

        internal object ParseValueModel(string parameter, Type type)
        {
            ICollection<string> errorMessages = new List<string>();
            object returnValue = Parse(type, parameter, errorMessages);
            if (errorMessages.Any())
                throw new WrongQueryParametersException(OperationErrorType.WrongInputParameter, errorMessages, parameter);
            return returnValue;
        }

        public abstract object Parse(Type type, string parameter, ICollection<string> errorMessages);
    }
}