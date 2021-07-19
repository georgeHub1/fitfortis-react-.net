using System.Diagnostics.CodeAnalysis;
using Backend.Entities;
using Backend.Utility;
using Newtonsoft.Json;

namespace Backend.ModelService
{
    /// <summary>
    ///     Describes a type model
    /// </summary>
    /// <typeparam name="TModel">The type of the model.</typeparam>
    //[ModelBinder(typeof(ApiServiceRequestBinder))] - see ApiServiceRequestBinderProvider usage
    [ExcludeFromCodeCoverage]
    public class ModelApiServiceRequest<TModel> : IApiServiceRequest<TModel> where TModel : BaseEntityModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ModelApiServiceRequest{TModel}"/> class.
        /// </summary>
        public ModelApiServiceRequest() { }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelApiServiceRequest{TModel}"/> class.
        /// </summary>
        /// <param name="data">The data.</param>
        public ModelApiServiceRequest(TModel data)
        {
            Data = data;
        }

        /// <summary>
        ///     Gets or sets the data.
        /// </summary>
        /// <value>
        ///     The data.
        /// </value>
        [AttributeRequestParameter]
        public TModel Data { get; set; }

        /// <summary>
        ///     Gets or sets the paging.
        /// </summary>
        /// <value>
        ///     The paging.
        /// </value>
        [JsonIgnore]
        [AttributeRequestParameter]
        public ModelPaging Paging { get; set; }
        /// <summary>
        ///     Gets or sets the sorting.
        /// </summary>
        /// <value>
        ///     The sorting.
        /// </value>
        [JsonIgnore]
        [AttributeRequestParameter]
        public ModelSorting Sorting { get; set; }
    }

    /// <summary>
    ///     Interface for api service request
    /// </summary>
    public interface IApiServiceRequest<TModel> : IApiServiceRequest where TModel : BaseEntityModel
    {
        TModel Data { get; set; }
    }

    public interface IApiServiceRequest
    {
        /// <summary>
        /// Gets or sets the paging.
        /// </summary>
        /// <value>
        /// The paging.
        /// </value>
        ModelPaging Paging { get; set; }

        /// <summary>
        ///     Gets or sets the sorting.
        /// </summary>
        /// <value>
        ///     The sorting.
        /// </value>
        ModelSorting Sorting { get; set; }
    }
}