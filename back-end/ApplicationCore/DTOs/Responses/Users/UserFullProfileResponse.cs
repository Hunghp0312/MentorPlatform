using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Users;

public class UserFullProfileResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhotoData { get; set; }
    public string? UserGoal { get; set; }
    public string? Bio { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfessionalSkill { get; set; }
    public string? IndustryExperience { get; set; }
    public List<EnumType> TeachingApproaches { get; set; } = new List<EnumType>();
    public List<EnumType> ProfileAvailabilities { get; set; } = new List<EnumType>();
    public List<EnumType> TopicOfInterests { get; set; } = new List<EnumType>();
    public List<EnumType> LearningStyles { get; set; } = new List<EnumType>();
    public required EnumType SessionFrequency { get; set; }
    public required EnumType SessionDuration { get; set; }
    public required EnumType Role { get; set; }
    public bool PrivacyProfile { get; set; } = true;
    public bool MessagePermission { get; set; } = true;
    public bool NotificationsEnabled { get; set; } = true;
    public required EnumType CommunicationMethod { get; set; }
    public List<EnumType> AreaOfExpertises { get; set; } = new List<EnumType>();
}
