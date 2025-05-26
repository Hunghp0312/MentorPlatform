using ApplicationCore.DTOs.Requests.Certifications;
using ApplicationCore.DTOs.Requests.Educations;
using ApplicationCore.DTOs.Requests.WorkExperiences;

namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class BaseMentorApplicationApiRequest
    {
        public required List<EducationDetailDto> EducationDetails { get; set; }
        public required List<WorkExperienceDetailDto> WorkExperienceDetails { get; set; }
        public required List<CertificationDetailDto> Certifications { get; set; }
    }
}
