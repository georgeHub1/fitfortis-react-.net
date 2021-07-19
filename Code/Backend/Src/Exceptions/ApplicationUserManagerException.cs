using System;
using System.Collections.Generic;
using System.Linq;
using Backend.ModelService;
using Microsoft.AspNetCore.Identity;

namespace Backend.Exceptions
{
    [Serializable]
    public class ApplicationUserManagerException : BaseException
    {
        public ApplicationUserManagerException(IEnumerable<ValidationError> errors) : base(ChangeMessage(errors))
        {
        }
        public ApplicationUserManagerException(IEnumerable<string> errors) : base(ChangeMessage(errors))
        {
        }

        public ApplicationUserManagerException(IEnumerable<IdentityError> errors) : base(ChangeMessage(errors))
        {
        }

        private static string ChangeMessage(IEnumerable<IdentityError> errors)
        {
            var errorStrings = errors.Select(x => x.Description);

            return ChangeMessage(errorStrings);
        }

        private static string ChangeMessage(IEnumerable<ValidationError> errors)
        {
            var errorStrings = errors.Select(x => x.Message);

            return ChangeMessage(errorStrings);
        }

        private static string ChangeMessage(IEnumerable<string> errors)
        {
            var error = errors != null ? errors.FirstOrDefault() : string.Empty;
            if (error == null)
            {
                error = string.Empty;
            }

            return error;
        }
    }
}
