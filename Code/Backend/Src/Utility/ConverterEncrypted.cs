using System;
using System.Linq.Expressions;
using Backend.Extensions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Backend.Utility
{
    public class ConverterEncrypted : ValueConverter<string, string>
    {
        public ConverterEncrypted(ConverterMappingHints mappingHints = null) : base(EncryptExpr, DecryptExpr, mappingHints)
        {
        }

        static readonly Expression<Func<string, string>> DecryptExpr = x => x.Decrypt();
        static readonly Expression<Func<string, string>> EncryptExpr = x => x.Encrypt();
    }
}