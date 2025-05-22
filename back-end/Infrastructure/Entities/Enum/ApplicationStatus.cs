namespace Infrastructure.Entities.Enum
{
    public class ApplicationStatus : EnumType
    {
        public virtual ICollection<MentorApplication> MentorApplications { get; set; } = new List<MentorApplication>();
    }
}
