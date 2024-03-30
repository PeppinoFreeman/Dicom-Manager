using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using WebApplication1.Attributes;
using WebApplication1.Case.Db;
using WebApplication1.Helpers;

namespace WebApplication1.Case
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class CaseController : ControllerBase, ICaseController
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<CaseController> _logger;
        private readonly ICaseRepository _caseRepository;
        private readonly BlobServiceClient _blobServiceClient;

        public CaseController(IConfiguration configuration, ILogger<CaseController> logger, ICaseRepository caseRepository,
            BlobServiceClient blobServiceClient)
        {
            _configuration = configuration;
            _logger = logger;
            _caseRepository = caseRepository;
            _blobServiceClient = blobServiceClient;
        }

        /// <summary>
        /// Fetch all the existent cases
        /// </summary>
        /// <returns>A List of CaseDto objects</returns>
        [HttpGet(Name = "GetCases")]
        public List<CaseDto> Get()
        {
            var caseList = new List<CaseDto>();
            _caseRepository.GetCases().ForEach(c => caseList.Add(new CaseDto(c)));

            return caseList;
        }

        /// <summary>
        /// Fetch a single case defined by the input parameter
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     GET /api/Case
        ///     {
        ///        "id": "string example",
        ///     }
        ///
        /// </remarks>
        /// <param name="id">Case's unique identifier</param>
        /// <returns>A CaseDto object representing the specified case</returns>
        /// <response code="201">Returns the newly created item</response>
        [HttpGet("{id}", Name = "GetCaseById")]
        public CaseDto GetById(string id)
        {
            var @case = _caseRepository.GetCases().Find(c => c.Id == id);
            if (@case is null)
            {
                throw new RequestFailedException("Case does not exist");
            }

            var caseDto = new CaseDto(@case);

            var sasToken = GenerateSharedAccessToken(id);

            caseDto.DicomUrl = caseDto.DicomUrl.ConvertAll(url => $"{url}{sasToken}");
            return caseDto;
        }

        /// <summary>
        /// Create a new case defined by the input parameter
        /// </summary>
        /// <returns>The Id of the create case object</returns>
        /// <response code="201">Returns the newly created case Id</response>
        [DisableFormValueModelBinding]
        [RequestSizeLimit(256 * 1024 * 1024)] // 256 MB
        [RequestFormLimits(MultipartBodyLengthLimit = 256 * 1024 * 1024)]
        [HttpPost(Name = "CreateCase")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        public async Task<IActionResult> Create()
        {
            _logger.LogInformation("Starting case creation");

            var @case = new Case();
            var dicomUrls = new List<string>();
            @case.Id = Guid.NewGuid().ToString();

            var reader = MultipartRequestHelper.GetMultipartReader(Request.ContentType, HttpContext.Request.Body);
            var section = await reader.ReadNextSectionAsync();

            while (section != null)
            {
                var hasContentDispositionHeader =
                    ContentDispositionHeaderValue.TryParse(
                        section.ContentDisposition, out var contentDisposition);

                if (!hasContentDispositionHeader)
                {
                    section = await reader.ReadNextSectionAsync();
                    continue;
                }

                if (!MultipartRequestHelper.HasFileContentDisposition(contentDisposition))
                {
                    await InsertFormFieldIntoCase(section, contentDisposition, @case);
                }
                else
                {
                    var streamedFileContent = await FileHelper.ProcessStreamedFile(section, contentDisposition);
                    var fileName = contentDisposition?.FileName.Value;

                    dicomUrls.Add(await UploadToAzureStorage(streamedFileContent, fileName, @case.Id));

                    _logger.LogInformation("Uploaded file '{fileName}' to Azure Blob Storage'", fileName);
                }
                section = await reader.ReadNextSectionAsync();
            }

            @case.DicomUrl = dicomUrls;

            await _caseRepository.AddCase(@case);
            _logger.LogInformation("ending case creation");

            return Ok(@case.Id);
        }

        /// <summary>
        /// Delete a single case defined by the input parameter
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     DELETE /api/Case
        ///     {
        ///        "id": "string example",
        ///     }
        ///
        /// </remarks>
        /// <param name="id">Case's unique identifier</param>
        /// <returns>The Id of the deleted case object</returns>
        /// <response code="201">Returns the deleted case Id</response>
        [HttpDelete("{id}", Name = "DeleteCase")]
        public async Task<IActionResult> Delete(string id)
        {
            var @case = _caseRepository.GetCases().Find(c => c.Id == id);
            if (@case is null)
            {
                throw new RequestFailedException("Case does not exist");
            }

            // TODO: Handle blob storage deletion
            await _caseRepository.DeleteCase(@case);

            return Ok(id);
        }

        /// <summary>
        /// Update a single case defined by the input parameter
        /// </summary>
        /// <remarks>
        /// Sample request:
        ///
        ///     PUT /api/Case
        ///     {
        ///        "id": "string example",
        ///     }
        ///
        /// </remarks>
        /// <param name="id">Case's unique identifier</param>
        /// <returns>The Id of the create case object</returns>
        /// <response code="201">Returns the newly created case Id</response>
        [HttpPut("{id}", Name = "UpdateCase")]
        public async Task<IActionResult> Update(string id, [FromBody] CaseInput caseInput)
        {
            var @case = _caseRepository.GetCases().Find(c => c.Id == id);
            if (@case is null)
            {
                throw new RequestFailedException("Case does not exist");
            }

            // To refactor
            @case.PatientName = caseInput.Name;
            @case.PatientSurname = caseInput.Surname;
            @case.PatientSex = caseInput.Sex;
            @case.PatientBirthdate = caseInput.Birthdate;

            // TODO: Handle blob storage update
            await _caseRepository.UpdateCase(@case);

            return Ok(id);
        }

        private async Task<string> UploadToAzureStorage(byte[] fileContent, string fileName, string id)
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

        private static async Task InsertFormFieldIntoCase(MultipartSection section, ContentDispositionHeaderValue? contentDisposition, Case @case)
        {
            var formValue = await section.ReadAsStringAsync();
            var formKey = contentDisposition?.Name.Value?.Trim('"');
            var formattedKey = string.Concat("Patient", formKey?[0].ToString().ToUpper(), formKey.AsSpan(1));

            var propertyInfo = @case.GetType().GetProperty(formattedKey);
            if (propertyInfo != null)
            {
                switch (formattedKey)
                {
                    case "PatientBirthdate":
                        var dateValue = DateTime.ParseExact(formValue, "yyyy-MM-ddTHH:mm:ss.fffZ", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.RoundtripKind);
                        propertyInfo.SetValue(@case, dateValue);
                        break;
                    case "PatientSex":
                        var genderValue = int.Parse(formValue);
                        propertyInfo.SetValue(@case, genderValue);
                        break;
                    default:
                        propertyInfo.SetValue(@case, formValue);
                        break;
                }
            }
        }

        private string GenerateSharedAccessToken(string id)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient($"container-{id}");
            var sasToken = containerClient.GenerateSasUri(BlobContainerSasPermissions.All, DateTimeOffset.UtcNow.AddMinutes(30)).Query;

            return sasToken;
        }
    }
}