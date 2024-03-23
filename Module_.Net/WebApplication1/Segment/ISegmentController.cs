using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Segment
{
    public interface ISegmentController
    {
        public Task<JsonResult> Get(string id);
    }
}