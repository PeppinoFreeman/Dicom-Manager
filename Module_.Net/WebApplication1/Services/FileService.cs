using Azure;
using Azure.Storage.Blobs;
using WebApplication1.Case;

namespace WebApplication1
{
    public class FileService
    {
        private readonly BlobServiceClient _blobServiceClient;

        public FileService(BlobServiceClient blobServiceClient)
        {
            _blobServiceClient = blobServiceClient;
        }

        public async Task<string> UploadToAzureStorage(byte[] fileContent, string fileName, string id)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient($"container-{id}");
                await containerClient.CreateIfNotExistsAsync();

                var blobClient = containerClient.GetBlobClient(fileName);

                using var imageStream = new MemoryStream(fileContent);
                await blobClient.UploadAsync(imageStream, true);
                return blobClient.Uri.ToString();
            }
            catch (RequestFailedException ex)
            {
                throw new RequestFailedException($"Could not upload the file : {ex}");
            }
        }

        public async Task DeleteBlobContainer(string id)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient($"container-{id}");
                await containerClient.DeleteIfExistsAsync();
            }
            catch (RequestFailedException ex)
            {
                throw new RequestFailedException($"Could not delete the file : {ex}");
            }
        }

    }
}