using System.ComponentModel;

namespace Backend.Utility
{
    public enum Alcohol
    {
        [Description("0")]
        No = 1,
        [Description("0")]
        OccasionallyWithMeals = 2,
        [Description("1")]
        WithEveryMeal = 3,
        [Description("2")]
        EveryDayWithAndWithoutMeal = 4,
        [Description("3")]
        HighDosageOfAlсoholDaily = 5

    }
}
