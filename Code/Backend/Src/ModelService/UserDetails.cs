using Backend.Entities;

namespace Backend.ModelService
{
    public class UserDetails : BaseEntity
    {
        public User User { get; set; }
    }
}