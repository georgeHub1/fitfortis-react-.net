using Backend.Entities;

namespace Backend.ModelService
{
    public class ShortControlCheckup : BaseEntity
    {
        public string Frequency { get; set; }
        public string ProfilacticCheckup { get; set; }
    }
}
