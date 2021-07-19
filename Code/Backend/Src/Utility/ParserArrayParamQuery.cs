using System;
using System.Collections;
using System.Collections.Generic;

namespace Backend.Utility
{
    /// <summary>
    /// ArrayParamQueryParser class
    /// </summary>
    /// <seealso cref="ParserQueryParams" />
    internal class ParserArrayParamQuery : ParserQueryParams
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
            string[] splitResult = parameter.Split(',');
            IList resultArray = (IList)Activator.CreateInstance(type, splitResult.Length);
            for (int i = 0; i < splitResult.Length; i++)
            {
                try
                {
                    resultArray[i] = (ParseSingleValue(type.GetElementType(), splitResult[i]));
                }
                catch (Exception e)
                {
                    errorMessages.Add(e.Message);
                }
            }
            return resultArray;
        }
    }
}