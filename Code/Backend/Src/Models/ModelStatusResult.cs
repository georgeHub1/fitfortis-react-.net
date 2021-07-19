using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace Backend.Models
{
    public class ModelStatusResult : BaseEntityModel
    {
        public ResultStatus Status { get; set; }
        public string Time { get; set; }
    }
}