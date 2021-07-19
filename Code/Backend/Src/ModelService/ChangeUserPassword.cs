using Backend.Entities;

namespace Backend.ModelService
{
    public class ChangeUserPassword : BaseEntity
    {
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}