using System;

namespace Backend.Configuration
{
    public interface IConfigApp
    {
        Uri ApiBaseUrl { get; }
        Uri WebAppBaseUrl { get; }
        string DbConnectionString { get; }
        string SendgridApiKey { get; }

        string StorageConnectionString { get; }
    }
}