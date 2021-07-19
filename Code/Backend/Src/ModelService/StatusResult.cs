using Backend.Entities;
using Backend.Utility;

namespace Backend.ModelService
{
    public class StatusResult : BaseEntity
    {
        public ResultStatus Status { get; set; }
        public string Time { get; set; }
    }
}