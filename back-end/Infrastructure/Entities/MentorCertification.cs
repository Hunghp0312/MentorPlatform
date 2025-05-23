namespace Infrastructure.Entities
{
    public class MentorCertification
    {
        public Guid Id { get; set; }
        public Guid MentorApplicationId { get; set; }
        public string CertificationName { get; set; } = string.Empty;
        public string IssuingOrganization { get; set; } = string.Empty;
        public virtual MentorApplication MentorApplication { get; set; } = null!;
    }
}
