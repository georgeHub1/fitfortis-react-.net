using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Backend.Extensions;
using Backend.ModelService;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace Backend.Utility
{
    /// <summary>
    /// ServiceRequestBinder class
    /// </summary>
    /// <seealso cref="IModelBinder" />
    public class BinderApiServiceRequest : IModelBinder
    {
        /// <summary>
        /// Binds the model.
        /// </summary>
        /// <param name="bindingContext">The binding context.</param>
        /// <returns></returns>
        /// <exception cref="string"></exception>
        public async Task BindModelAsync(ModelBindingContext bindingContext)
        {
            if (bindingContext == null)
            {
                return;
            }
            var model = await Task.Run(() => Activator.CreateInstance(bindingContext.ModelType) as IApiServiceRequest);

            if (model == null) return;

            var requestParameterProperties = model.GetType().GetProperties()
                .Where(prop => Attribute.IsDefined(prop, typeof(AttributeRequestParameter))).ToList();

            foreach (var propertyInfo in requestParameterProperties)
            {
                var requestParameter = Activator.CreateInstance(propertyInfo.PropertyType);
                ProvideValuesForObjectProperties(bindingContext, requestParameter);
                requestParameter.ValidateQueryParameter();

                propertyInfo.SetValue(model, requestParameter);
            }

            model.Paging = HandleModelPaging(model.Paging);
            model.Sorting = HandleModelSorting(model.Sorting);

            bindingContext.Result = ModelBindingResult.Success(model);

            //bindingContext.Model = model;
        }
        
        private ModelSorting HandleModelSorting(ModelSorting sorting)
        {
            return (sorting != null && (sorting.Field != null || sorting.Asc != null)) ? sorting : null;
        }

        private ModelPaging HandleModelPaging(ModelPaging paging)
        {
            return (paging != null && (paging.MaxItems != null || paging.StartItem != null)) ? paging : null;
        }

        private void ProvideValuesForObjectProperties(ModelBindingContext bindingContext, object requestParameter)
        {
            IEnumerable<PropertyInfo> bindingMemberProperties = requestParameter.GetType().GetProperties(
            ).Where(prop => Attribute.IsDefined(prop, typeof(AttributeBindingMember)));
            foreach (PropertyInfo property in bindingMemberProperties)
            {
                var providerName = GetBindingProviderName(property);
                var provider = bindingContext.ValueProvider.GetValue(providerName);
                if (provider.FirstValue != null)
                {
                    ParserQueryParams parser = GetQueryParamsParser(property.PropertyType);
                    object propertyValue = parser.ParseValueModel(provider.FirstValue, property.PropertyType);
                    if (propertyValue != null)
                        property.SetValue(requestParameter, propertyValue);
                }
            }
        }

        internal static ParserQueryParams GetQueryParamsParser(Type querryParamsType)
        {
            return querryParamsType.IsArray ? (ParserQueryParams)new ParserArrayParamQuery() : new SingleParamQueryParser();
        }

        internal static string GetBindingProviderName(PropertyInfo property)
        {
            var attribute = property.GetCustomAttributes(typeof(AttributeBindingMember), false).SingleOrDefault() as AttributeBindingMember;
            return attribute?.Name;
        }
    }
}
