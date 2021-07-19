using Backend.Entities;

namespace Backend.ModelService
{
    public class KeysData<T> : BaseEntity
    {
        public KeysData() { }
        public KeysData(T[] keys)
        {
            Keys = keys;
        }
        public T[] Keys { get; set; }
    }
}