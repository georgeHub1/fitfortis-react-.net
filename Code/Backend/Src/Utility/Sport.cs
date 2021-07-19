using System.ComponentModel;

namespace Backend.Utility
{
    public enum Sport
    {
        [Description("2")]
        LowIntensity = 1,
        [Description("-2")]
        Moderately = 2,
        [Description("-4")]
        Intensively = 3,
    }
}
