using Azure;
using Azure.Storage.Blobs;

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
                await containerClient.DeleteAsync();
            }
            catch (RequestFailedException ex)
            {
                throw new RequestFailedException($"Could not delete the file : {ex}");
            }
        }

        public async Task UpdateBlobContainer(string id)
        {
            try
            {
                var containerClient = _blobServiceClient.GetBlobContainerClient($"container-{id}");
                // To Complete
            }
            catch (RequestFailedException ex)
            {
                throw new RequestFailedException($"Could not update the file : {ex}");
            }

        }
    }
}