namespace Infrastructure.Entities
{
    public class MentorWorkExperience
    {
        public Guid Id { get; set; }
        public Guid MentorApplicationId { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public string? Description { get; set; }

        // Navigation Property
        public virtual MentorApplication MentorApplication { get; set; } = null!;
    }
}
