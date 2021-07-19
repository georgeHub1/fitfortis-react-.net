using System;
using Backend.Utility;

namespace Backend.Configuration
{
    public static class ConfigApp
    {
        private static IConfigApp _instance;

        public static IConfigApp Settings {
            get
            {
#if Production
                if (_instance == null) _instance = GetConfig(BuildEnvironmentType.Production);
#elif Staging
                if (_instance == null) _instance = GetConfig(BuildEnvironmentType.Staging);
#elif QA
                if (_instance == null) _instance = GetConfig(BuildEnvironmentType.Qa);
#else
                if (_instance == null) _instance = GetConfig(BuildEnvironmentType.Localhost);
#endif
                return _instance;
            }
        }

        public static IConfigApp GetConfig(BuildEnvironmentType type)
        {
            switch (type)
            {
                case BuildEnvironmentType.Localhost:
                    return new ConfigAppLocalhost();
                case BuildEnvironmentType.Qa:
                    return new ConfigAppQa();
                case BuildEnvironmentType.Staging:
                    return new ConfigAppStaging();
                case BuildEnvironmentType.Production:
                    return new ConfigAppProduction();
                default:
                    throw new ArgumentOutOfRangeException(nameof(type), type, null);
            }
        }

        public static BuildEnvironmentType CurrentBuildEnvironmentType
        {
            get
            {
                // the order matters
                if (_instance is ConfigAppProduction) return BuildEnvironmentType.Production;
                if (_instance is ConfigAppStaging) return BuildEnvironmentType.Staging;
                if (_instance is ConfigAppQa) return BuildEnvironmentType.Qa;
                if (_instance is ConfigAppLocalhost) return BuildEnvironmentType.Localhost;
                
                return BuildEnvironmentType.Unknown;
            }
        }
    }
}
