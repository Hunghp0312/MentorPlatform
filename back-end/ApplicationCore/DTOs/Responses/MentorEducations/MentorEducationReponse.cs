
namespace ApplicationCore.DTOs.Responses.MentorEducations
{
    public class MentorEducationReponse
    {
        public string InstitutionName { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public int? GraduationYear { get; set; }
    }
}