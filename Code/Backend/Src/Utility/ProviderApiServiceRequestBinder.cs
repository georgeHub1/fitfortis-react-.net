using System.Linq;
using Backend.ModelService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;

namespace Backend.Utility
{

    public static class MvcOptionsExtensions
    {
        public static void UseApiServiceRequestBinder(this MvcOptions opts)
        {
            var binderToFind = opts.ModelBinderProviders.FirstOrDefault(x => x.GetType() == typeof(SimpleTypeModelBinderProvider)); // Use BodyModelBinder for POST

            if (binderToFind == null) return;

            var index = opts.ModelBinderProviders.IndexOf(binderToFind);
            opts.ModelBinderProviders.Insert(index, new ProviderApiServiceRequestBinder());
        }
    }
    public class ProviderApiServiceRequestBinder : IModelBinderProvider
    {
        public IModelBinder GetBinder(ModelBinderProviderContext context)
        {
            if (context.Metadata.ModelType.IsGenericType)
            {
                var incomingGenericType = context.Metadata.ModelType.GetGenericTypeDefinition();
                if (incomingGenericType == typeof(ModelApiServiceRequest<>))
                {
                    return new BinderApiServiceRequest();
                }
            }

            return null;
        }
    }
}