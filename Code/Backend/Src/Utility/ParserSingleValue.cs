using System;
using System.Collections.Generic;

namespace Backend.Utility
{
    internal class SingleParamQueryParser : ParserQueryParams
    {
        /// <summary>
        /// Parses the specified type.
        /// </summary>
        /// <param name="type">The type.</param>
        /// <param name="parameter">The parameter.</param>
        /// <param name="errorMessages">The error messages.</param>
        /// <returns></returns>
        public override object Parse(Type type, string parameter, ICollection<string> errorMessages)
        {
            try
            {
                return ParseSingleValue(type, parameter);
            }
            catch (Exception e)
            {
                errorMessages.Add(e.Message);
                return null;
            }
        }
    }
}