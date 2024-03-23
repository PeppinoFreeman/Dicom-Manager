namespace WebApplication1.Case
{
    public class Case
    {
        public string Id { get; set; }
        public string PatientName { get; set; }
        public string PatientSurname { get; set; }
        public Sex PatientSex { get; set; }
        public DateTime PatientBirthdate { get; set; }

        public List<string> DicomUrl { get; set; }
    }

    public enum Sex
    {
        F, // Female
        M, // Male
        O  // Other
    }
}
