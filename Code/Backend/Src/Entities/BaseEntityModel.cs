namespace Backend.Entities
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    public abstract class BaseEntityModel
    {
    }

    /// <summary>
    /// Describes a type model
    /// </summary>
    /// <seealso cref="BaseEntityModel" />
    public class EmptyEntityModel : BaseEntityModel
    {
    }

    /// <summary>
    /// Describes a type model
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public abstract class BaseEntityModel<T> : EmptyEntityModel, IIdentifiable<T>
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public virtual T Id { get; set; }
    }
}
