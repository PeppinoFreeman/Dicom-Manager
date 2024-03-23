namespace WebApplication1.Case.Db
{
    public interface ICaseRepository
    {
        public List<Case> GetCases();
        public Task AddCase(Case @case);
        public Task DeleteCase(Case @case);
        public Task UpdateCase(Case @case);
    }
}