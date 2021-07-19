using System.ComponentModel;

namespace Backend.Utility
{
    public enum TobaccoConsumption
    {
        [Description("0")]
        No = 1,
        [Description("4")]
        LessTenPerDay = 2,
        [Description("4")]
        MoreTenPerDay = 3,
        [Description("2")]
        Pipe = 4,
        [Description("2")]
        PastSmoker = 5,
    }
}
