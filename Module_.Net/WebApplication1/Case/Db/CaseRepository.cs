namespace WebApplication1.Case.Db
{
    public class CaseRepository : ICaseRepository
    {
        public CaseRepository()
        {
            using var context = new AppDbContext();
            if (!context.Cases.Any())
            {
                var cases = new List<Case>
                {
                    new()
                    {
                        Id = "2a571e2f-356d-469c-bd19-cea7d2cd688b",
                        PatientName = "Peppino",
                        PatientSurname = "Freeman",
                        PatientBirthdate = new DateTime(1996, 4, 17),
                        PatientSex = Sex.O,
                        DicomUrl = new List<string>()
                        {
                         "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-01.dcm",
                         "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-02.dcm",
                        }
                    },
                    new()
                    {
                        Id = "2",
                        PatientName = "Mahmoud",
                        PatientSurname = "Perreira",
                        PatientBirthdate = new DateTime(1991, 5, 24),
                        PatientSex = Sex.M,
                        DicomUrl = new List<string>()
                        {
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-01.dcm",
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-02.dcm",
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-03.dcm",
                        }
                    },
                    new()
                    {
                        Id = "029e7314-5de6-4c1f-be9c-820fbf87db96",
                        PatientName = "Svetlana",
                        PatientSurname = "Bartovsky",
                        PatientBirthdate = new DateTime(1998, 6, 5),
                        PatientSex = Sex.F,
                        DicomUrl = new List<string>()
                        {
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-01.dcm",
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-02.dcm",
                            "http://127.0.0.1:10000/devstoreaccount1/container-969c7805-3b7e-4b9e-93e1-28497e29105a/1-03.dcm"
                        }
                    }
                };

                context.Cases.AddRange(cases);
                context.SaveChanges();
            }
        }

        public List<Case> GetCases()
        {
            using var context = new AppDbContext();
            return context.Cases.ToList();
        }

        public async Task AddCase(Case @case)
        {
            await using var context = new AppDbContext();
            context.Cases.Add(@case);
            await context.SaveChangesAsync();
        }

        public async Task DeleteCase(Case @case)
        {
            await using var context = new AppDbContext();
            context.Cases.Remove(@case);
            await context.SaveChangesAsync();
        }

        public async Task UpdateCase(Case @case)
        {
            await using var context = new AppDbContext();
            context.Cases.Update(@case);
            await context.SaveChangesAsync();
        }
    }
}
