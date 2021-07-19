using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Http;

namespace Backend.BusinessServices
{
    public interface IBlobService 
    {
        Task<ServiceResponse<FileUploadDetails>> UploadFileAsync(AttachmentType containerType, IFormFile file,
            Guid userId, string subFolder = null, IDictionary<string, string> metadata = null);
        Task<ServiceResponse<FileUploadDetails>> UploadLargeFileAsync(AttachmentType containerType, IFormFile file,
            Guid userId, string subFolder = null, IDictionary<string, string> metadata = null);

        Task<ServiceResponse<FileUploadDetails>> DownloadFileAsync(AttachmentType containerType, Guid fileId, string subfolder = null);

        Task<ServiceResponse<FileUploadDetails>> RemoveFileAsync(AttachmentType containerType, Guid fileId);
    }
}
