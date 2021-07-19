using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Backend.Configuration;
using Backend.Exceptions;
using Backend.Extensions;
using Backend.ModelService;
using Backend.Utility;
using Microsoft.AspNetCore.Http;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Backend.BusinessServices
{
    public class BlobService : BaseService, IBlobService
    {
        public async Task<ServiceResponse<FileUploadDetails>> UploadFileAsync(AttachmentType containerType, IFormFile file, Guid userId, string subFolder = null, IDictionary<string, string> metadata = null)
        {
            if (file == null)
            {
                return null;
            }

            var storageAccount = CloudStorageAccount.Parse(ConfigApp.Settings.StorageConnectionString);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            var folder = GetBlobFolderPath(containerType, subFolder);
            CloudBlobContainer blobContainer = blobClient.GetContainerReference(GetContainerName(containerType));

            await blobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);
            if (containerType == AttachmentType.Encyclopedia || containerType == AttachmentType.NewsPicture)
            {
                var permissions = await blobContainer.GetPermissionsAsync().ConfigureAwait(false);
                permissions.PublicAccess = BlobContainerPublicAccessType.Container;
            }
            CloudBlockBlob blob;

            var id = Guid.NewGuid();
            var blobName = $"{folder}/{id.ToString().ToLower(CultureInfo.InvariantCulture)}";

            try
            {
                blob = blobContainer.GetBlockBlobReference(blobName);
                await blob.UploadFromStreamAsync(file.OpenReadStream()).ConfigureAwait(false);

                blob.Metadata.Add(Constants.BlobMetadataFileName, file.FileName.Base64Encode());
                blob.Metadata.Add(Constants.BlobMetadataUserId, userId.ToString());

                if (metadata != null)
                {
                    foreach (var item in metadata)
                    {
                        if (!string.IsNullOrEmpty(item.Value))
                        {
                            blob.Metadata.Add(item);
                        }
                    }
                }

                await blob.SetMetadataAsync().ConfigureAwait(false);
            }
            catch (HttpRequestException)
            {
                // 404 NotFound
                return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
                {
                    FileUrl = null
                });
            }

            return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
            {
                FileUrl = $"{blobContainer.Uri.AbsoluteUri}/{blobName}",
                Id = id,
                FileName = file.FileName,
                UserId = userId,
                ContentType = file.ContentType,
                ContentLength = blob.Properties.Length,
                SavedAt = blob.Properties.LastModified,
            });
        }

        public async Task<ServiceResponse<FileUploadDetails>> UploadLargeFileAsync(AttachmentType containerType, IFormFile file, Guid userId, string subFolder = null, IDictionary<string, string> metadata = null)
        {
            if (file == null)
            {
                return null;
            }

            var storageAccount = CloudStorageAccount.Parse(ConfigApp.Settings.StorageConnectionString);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();

            var folder = GetBlobFolderPath(containerType, subFolder);
            CloudBlobContainer blobContainer = blobClient.GetContainerReference(GetContainerName(containerType));

            await blobContainer.CreateIfNotExistsAsync().ConfigureAwait(false);
            CloudBlockBlob blob;

            var id = Guid.NewGuid();
            var blobName = $"{folder}/{id.ToString().ToLower(CultureInfo.InvariantCulture)}";

            try
            {
                blob = blobContainer.GetBlockBlobReference(blobName);
                HashSet<string> blocklist = new HashSet<string>();

                var memoryStream = new MemoryStream();
                file.CopyTo(memoryStream);

                byte[] fileContent = memoryStream.GetBuffer();
                long prevLastByte = 0;
                long bytesRemain = fileContent.Length;

                do
                {
                    long bytesToCopy = Math.Min(bytesRemain, Constants.BlobPageSizeInBytes);
                    byte[] bytesToSend = new byte[bytesToCopy];
                    Array.Copy(fileContent, prevLastByte, bytesToSend, 0, bytesToCopy);
                    prevLastByte += bytesToCopy;
                    bytesRemain -= bytesToCopy;

                    //create blockId
                    string blockId = Guid.NewGuid().ToString();
                    string base64BlockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(blockId));

                    await blob.PutBlockAsync(
                        base64BlockId,
                        new MemoryStream(bytesToSend, true),
                        null
                    ).ConfigureAwait(false);

                    blocklist.Add(base64BlockId);

                } while (bytesRemain > 0);

                //post blocklist
                await blob.PutBlockListAsync(blocklist).ConfigureAwait(false);

                blob.Metadata.Add(Constants.BlobMetadataFileName, file.FileName.Base64Encode());
                blob.Metadata.Add(Constants.BlobMetadataUserId, userId.ToString());

                if (metadata != null)
                {
                    foreach (var item in metadata)
                    {
                        if (!string.IsNullOrEmpty(item.Value))
                        {
                            blob.Metadata.Add(item);
                        }
                    }
                }

                await blob.SetMetadataAsync().ConfigureAwait(false);
            }
            catch (HttpRequestException)
            {
                // 404 NotFound
                return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
                {
                    FileUrl = null
                });
            }

            return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
            {
                FileUrl = $"{blobContainer.Uri.AbsoluteUri}/{blobName}",
                Id = id,
                FileName = file.FileName.Base64Decode(),
                UserId = userId,
                ContentType = file.ContentType,
                ContentLength = blob.Properties.Length,
                SavedAt = blob.Properties.LastModified,
            });
        }

        public async Task<ServiceResponse<FileUploadDetails>> DownloadFileAsync(AttachmentType containerType, Guid fileId, string subfolder = null)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigApp.Settings.StorageConnectionString);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer blobContainer = blobClient.GetContainerReference(GetContainerName(containerType));

            var folder = GetBlobFolderPath(containerType, subfolder);
            var blobName = $"{folder}/{fileId}";

            var blob = blobContainer.GetBlockBlobReference(blobName);
            if (!blob.ExistsAsync().Result)
            {
                throw new EntityNotFoundException("File not found.");
            }

            var ms = new MemoryStream();

            await blob.DownloadToStreamAsync(ms).ConfigureAwait(false);
            

            await blob.FetchAttributesAsync().ConfigureAwait(false);

            blob.Metadata.TryGetValue(Constants.BlobMetadataFileName, out var fileName);
            blob.Metadata.TryGetValue(Constants.BlobMetadataUserId, out string userIdStr);
            Guid.TryParse(userIdStr, out var userId);

            return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
            {
                Stream = ms,
                FileName = fileName,
                ContentType = blob.Properties.ContentType,
                ContentLength = blob.Properties.Length,
                UserId = userId == Guid.Empty ? userId : (Guid?)null,
                Id = fileId,
                SavedAt = blob.Properties.LastModified
            });
        }

        public async Task<ServiceResponse<FileUploadDetails>> RemoveFileAsync(AttachmentType containerType, Guid fileId)
        {
            var storageAccount = CloudStorageAccount.Parse(ConfigApp.Settings.StorageConnectionString);
            CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
            CloudBlobContainer blobContainer = blobClient.GetContainerReference(GetContainerName(containerType));

            var folder = GetBlobFolderPath(containerType);
            var blobName = $"{folder}/{fileId}";

            var blob = blobContainer.GetBlockBlobReference(blobName);
            
            await blob.DeleteIfExistsAsync().ConfigureAwait(false);

            return new ServiceResponse<FileUploadDetails>(new FileUploadDetails
            {
                Id = fileId,
                SavedAt = blob.Properties.LastModified,
            });
        }


        private string GetBlobFolderPath(AttachmentType containerType, string subFolder = null)
        {
            var rootFolder = containerType.ToString();
            if (!string.IsNullOrEmpty(subFolder))
            {
                return $"{rootFolder}/{subFolder}".ToLower(CultureInfo.InvariantCulture);
            }

            return rootFolder.ToLower(CultureInfo.InvariantCulture);
        }

        private string GetContainerName(AttachmentType containerType)
        {
            switch (containerType)
            {
                case AttachmentType.Document:
                    return Constants.AzureBlobUploadsPrivateContainerName;
                case AttachmentType.Avatar:
                    return Constants.AzureBlobUploadsPrivateContainerName;
                default:
                    return Constants.AzureBlobUploadsPublicContainerName;
            }
        }

    }
}
