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
        [Required]
        public List<Image> Images { get; set; }
    }

    public class Image
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public byte[] Content { get; set; }
    }
}
