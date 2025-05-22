using ApplicationCore.DTOs.Requests.Certifications;
using ApplicationCore.DTOs.Requests.Educations;
using ApplicationCore.DTOs.Requests.WorkExperiences;
using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class SubmitMentorApplicationApiRequest
    {
        public required string MotivationStatement { get; set; } = string.Empty;
        public required List<EducationDetailDto> EducationDetails { get; set; }
        public required List<WorkExperienceDetailDto> WorkExperienceDetails { get; set; }
        public required List<CertificationDetailDto> Certifications { get; set; }
        public required IFormFile SupportingDocument { get; set; }
    }
}
