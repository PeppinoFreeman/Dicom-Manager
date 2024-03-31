using Microsoft.AspNetCore.Mvc;

namespace WebApplication1.Case
{
    public interface ICaseController
    {
        public List<CaseOutput> Get();
        public CaseOutput GetById(string id);
        public Task<IActionResult> Create();
        public Task<IActionResult> Delete(string id);
        public Task<IActionResult> Update(string id);
        public string GenerateSharedAccessToken(string id);
    }
}