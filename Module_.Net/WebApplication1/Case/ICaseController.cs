using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Case
{
    public interface ICaseController
    {
        public List<CaseDto> Get();
        public CaseDto GetById(string id);
        public Task<ActionResult> Create();

    }
}