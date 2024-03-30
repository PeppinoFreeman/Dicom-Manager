using System.ComponentModel.DataAnnotations;

namespace WebApplication1.Case
{
    public class CaseInput
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public DateTime Birthdate { get; set; }
        [Required]
        public Sex Sex { get; set; }
        // public List<IFormFile> Images { get; set; }
    }
}
