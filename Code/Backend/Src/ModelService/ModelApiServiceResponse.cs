using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace Backend.ModelService
{
    /// <summary>
    /// Describes a type model
    /// </summary>
    /// <typeparam name="TModel">The type of the model.</typeparam>
    [ExcludeFromCodeCoverage]
    public class ModelApiServiceResponse<TModel> //where TModel : BaseEntityModel
    {
        /// <summary>
        /// Gets or sets the item.
        /// </summary>
        /// <value>
        /// The item.
        /// </value>
        public TModel Item { get; set; }
        /// <summary>
        /// Gets or sets the items.
        /// </summary>
        /// <value>
        /// The items.
        /// </value>
        public List<TModel> Items { get; set; }
        /// <summary>
        /// Gets or sets the total.
        /// </summary>
        /// <value>
        /// The total.
        /// </value>
        public int? Total { get; set; }
        /// <summary>
        /// Gets or sets the errors.
        /// </summary>
        /// <value>
        /// The errors.
        /// </value>
        public List<ModelValidationError> Errors { get; set; }
        /// <summary>
        /// Gets a value indicating whether this <see cref="ModelApiServiceResponse{TModel}"/> is success.
        /// </summary>
        /// <value>
        ///   <c>true</c> if success; otherwise, <c>false</c>.
        /// </value>
        public bool Success => Errors == null || !Errors.Any();

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelApiServiceRequest{TModel}"/> class.
        /// </summary>
        public ModelApiServiceResponse()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelApiServiceResponse{TModel}"/> class.
        /// </summary>
        /// <param name="item">The item.</param>
        public ModelApiServiceResponse(TModel item)
        {
            Item = item;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ModelApiServiceResponse{TModel}"/> class.
        /// </summary>
        /// <param name="items">The items.</param>
        /// <param name="total">The total.</param>
        public ModelApiServiceResponse(List<TModel> items, int? total)
        {
            Items = items;
            Total = total;
        }

        /// <summary>
        /// Changes the type of the item model.
        /// </summary>
        /// <typeparam name="TValueType">The type of the value type.</typeparam>
        /// <param name="callback">The callback.</param>
        /// <returns></returns>
        public ModelApiServiceResponse<TValueType> ChangeItemModelType<TValueType>(Func<TValueType> callback)
        {
            return new ModelApiServiceResponse<TValueType>()
            {
                Errors = Errors,
                Item = callback(),
                Total = Total,
                //Items = null,
            };
        }

        /// <summary>
        /// Changes the type of the items model.
        /// </summary>
        /// <typeparam name="TValueType">The type of the value type.</typeparam>
        /// <param name="callback">The callback.</param>
        /// <returns></returns>
        public ModelApiServiceResponse<TValueType> ChangeItemsModelType<TValueType>(Func<List<TValueType>> callback)
        {
            return new ModelApiServiceResponse<TValueType>()
            {
                Errors = Errors,
                Items = callback(),
                Total = Total,
                //Item = null,
            };
        }
    }
}
