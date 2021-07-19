using Backend.Entities;

namespace Backend.Models
{
        public class KeysDataModel<T> : BaseEntityModel
        {
            public virtual T[] Keys { get; set; }
        }
}