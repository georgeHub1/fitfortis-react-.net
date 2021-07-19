using System;
using System.Globalization;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using Microsoft.WindowsAzure.Storage.Blob;

namespace Backend.Utility
{
    public class BlobFileUploadProvider : MultipartFormDataStreamProvider
    {
        private readonly CloudBlobContainer _blobContainer;
        private readonly string _folder;

        public Guid Id { get; }
        public CloudBlockBlob Blob { get; set; }
        public string OriginalFileName { get; set; }

        public BlobFileUploadProvider(CloudBlobContainer blobContainer, string folder) : base("azure")
        {
            _blobContainer = blobContainer;
            _folder = folder;
            Id = Guid.NewGuid();
        }

        public override Stream GetStream(HttpContent parent, HttpContentHeaders headers)
        {
            if (parent == null) throw new ArgumentNullException(nameof(parent));
            if (headers == null) throw new ArgumentNullException(nameof(headers));

            var blobName = $"{_folder}/{Id.ToString().ToLower(CultureInfo.InvariantCulture)}";

            Blob = _blobContainer.GetBlockBlobReference(blobName);

            OriginalFileName = headers.ContentDisposition.FileName.Trim('\"');

            if (headers.ContentType != null)
            {
                Blob.Properties.ContentType = headers.ContentType.MediaType;
            }

            this.FileData.Add(new MultipartFileData(headers, Blob.Name));

            return Blob.OpenWriteAsync().Result;
        }
    }
}