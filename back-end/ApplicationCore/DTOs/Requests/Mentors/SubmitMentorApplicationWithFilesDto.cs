using System.ComponentModel.DataAnnotations;

namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class SubmitMentorApplicationWithFilesDto
    {
        [Required]
        public string MotivationStatement { get; set; } = string.Empty;

        public List<CertificationDetailDto>? Certifications { get; set; }

        //public List<IFormFile>? SupportingDocuments { get; set; }
    }
}
