using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Segment
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class SegmentController : ControllerBase, ISegmentController
    {
        private readonly IConfiguration _configuration;

        public SegmentController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("{id}", Name = "GetSegmentedDicomById")]
        public async Task<JsonResult> Get(string id)
        {
            var url = _configuration.GetSection("AzureFunctionUrl").Value;

            using HttpClient httpClient = new HttpClient();
            HttpResponseMessage response = await httpClient.GetAsync($"{url}?id={id}");

            var content = await response.Content.ReadAsByteArrayAsync();
            var base64Content = Convert.ToBase64String(content);

            return new JsonResult(new { content = base64Content });
        }
    }
}
