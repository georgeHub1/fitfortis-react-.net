using System;
using System.Threading.Tasks;
using Backend.BusinessServices;
using Backend.Configuration;
using Backend.Entities;
using Backend.Models;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route(Constants.DefaultControllerRoute)]
    public class EncyclopediaMedicineController : BaseApiController
    {
        private readonly IServiceMedicine _serviceDrug;
        private readonly IServiceSearchRequest _serviceSearchRequest;

        public EncyclopediaMedicineController(IServiceMedicine serviceDrug, IServiceSearchRequest serviceSearchRequest)
        {
            _serviceDrug = serviceDrug;
            _serviceSearchRequest = serviceSearchRequest;
        }

        [HttpGet("search/lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllDrugs(string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchTerms, ModelSearchTerms>(
                ApiOperationType.GetAllDrugs,
                apiRequest,
                async request => await _serviceDrug.GetMedicineSearchTerms(request, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("{id:Guid}/lang/{languageCode}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDrugById(Guid id, string languageCode, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Drug, ModelDrug>(
                ApiOperationType.GetDrugById,
                apiRequest,
                async request => await _serviceDrug.GetMedicineById(request, id, languageCode).ConfigureAwait(false),
                useTransaction: false).ConfigureAwait(false);
        }

        [HttpGet("searchhistory/user/{userId}")]
        public async Task<IActionResult> GetMedicineSearchHistory(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.GetMedicineSearchHistory,
                apiRequest,
                async request => await _serviceSearchRequest.GetRecentHistory(request, userId, null, SearchArea.Medicine).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPost]
        public async Task<IActionResult> CreateMedicineEntry([FromBody]ModelApiServiceRequest<ModelDrug> apiRequest)
        {
            return await ExecuteServiceAsync<ModelDrug, Drug, Drug, ModelDrug>(
                ApiOperationType.CreateMedicine,
                apiRequest,
                async request => await _serviceDrug.AddMedicineItem(request, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpPatch("searchhistory")]
        [AllowAnonymous]
        public async Task<IActionResult> AddMedicineSearch([FromBody]ModelApiServiceRequest<ModelSearchRequest> apiRequest)
        {
            return await ExecuteServiceAsync<ModelSearchRequest, SearchRequest, SearchRequest, ModelSearchRequest>(
                ApiOperationType.AddMedicineSearch,
                apiRequest,
                async request =>
                {
                    request.Data.SearchArea = SearchArea.Medicine;
                    return await _serviceSearchRequest.AddSearchRequest(request, request.Data).ConfigureAwait(false);
                }).ConfigureAwait(false);
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateMedicineEntry(Guid id, [FromBody]ModelApiServiceRequest<ModelUpdateEncyclopediaEntity> apiRequest)
        {
            return await ExecuteServiceAsync<ModelUpdateEncyclopediaEntity, UpdateEncyclopediaEntity, Drug, ModelDrug>(
                ApiOperationType.UpdateMedicine,
                apiRequest,
                async request => await _serviceDrug.UpdateMedicineItem(request, id, request.Data).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteMedicineEntry(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, Drug, ModelDrug>(
                ApiOperationType.DeleteMedicine,
                apiRequest,
                async request => await _serviceDrug.DeleteMedicineItem(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/{id:Guid}")]
        public async Task<IActionResult> DeleteMedicineSearchItem(Guid id, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteMedicineSearchById,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequests(request, id).ConfigureAwait(false)).ConfigureAwait(false);
        }

        [HttpDelete("searchhistory/user/{userId}")]
        public async Task<IActionResult> DeleteAllMedicineSearch(Guid userId, ModelApiServiceRequest<EmptyEntityModel> apiRequest)
        {
            return await ExecuteServiceAsync<EmptyEntityModel, EmptyEntity, SearchRequest, ModelSearchRequest>(
                ApiOperationType.DeleteAllMedicineSearchItems,
                apiRequest,
                async request => await _serviceSearchRequest.RemoveSearchRequestsForArea(request, userId, SearchArea.Medicine).ConfigureAwait(false)).ConfigureAwait(false);
        }
    }
}
