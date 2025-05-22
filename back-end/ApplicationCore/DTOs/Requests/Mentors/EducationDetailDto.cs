namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class EducationDetailDto
    {
        public string InstitutionName { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public int? GraduationYear { get; set; }
    }
}
