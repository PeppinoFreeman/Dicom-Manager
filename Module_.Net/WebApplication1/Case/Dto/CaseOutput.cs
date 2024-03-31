using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Case
{
    public class CaseOutput
    {
        [Required]
        public string Id { get; protected set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public DateTime Birthdate { get; set; }
        [Required]
        public Sex Sex { get; set; }
        public List<string> DicomUrl { get; set; }
        public CaseOutput(Case inputCase)
        {
            Id = inputCase.Id;
            Name = inputCase.PatientName;
            Surname = inputCase.PatientSurname;
            Birthdate = inputCase.PatientBirthdate;
            Sex = inputCase.PatientSex;
            DicomUrl = inputCase.DicomUrl;
        }
    }
}
