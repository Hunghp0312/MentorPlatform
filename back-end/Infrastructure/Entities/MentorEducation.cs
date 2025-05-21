namespace Infrastructure.Entities
{
    public class MentorEducation
    {
        public Guid Id { get; set; }
        public Guid MentorApplicationId { get; set; }
        public string InstitutionName { get; set; } = string.Empty;
        public string FieldOfStudy { get; set; } = string.Empty;
        public int? GraduationYear { get; set; }

        public virtual MentorApplication MentorApplication { get; set; } = null!;
    }
}
