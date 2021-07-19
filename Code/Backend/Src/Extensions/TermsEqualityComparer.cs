using System;
using System.Collections.Generic;
using Backend.ModelService;

namespace Backend.Extensions
{
    public class TermsEqualityComparer : IEqualityComparer<SearchTerms>
    {
        public bool Equals(SearchTerms x, SearchTerms y)
        {
            return x?.Title == y?.Title;
        }

        public int GetHashCode(SearchTerms obj)
        {
            return obj.Title.GetHashCode(StringComparison.InvariantCulture);
        }
    }
}