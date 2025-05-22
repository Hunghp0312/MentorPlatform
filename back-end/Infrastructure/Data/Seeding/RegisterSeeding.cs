using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class RegisterSeeding
    {
        public static List<User> SeedUsers()
        {
            return new List<User>
            {
                new User
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                    Email = "john.doe@example.com",
                    PasswordHash = "hashed_password_1",
                    RoleId = 1,
                    LastLogin = DateTime.UtcNow,
                    PasswordResetToken = string.Empty,
                    PasswordResetExpiry = DateTime.UtcNow.AddDays(30),
                    RefreshToken = string.Empty,
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30)
                },
                new User
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    Email = "jane.smith@example.com",
                    PasswordHash = "hashed_password_2",
                    RoleId = 2,
                    LastLogin = DateTime.UtcNow,
                    PasswordResetToken = string.Empty,
                    PasswordResetExpiry = DateTime.UtcNow.AddDays(30),
                    RefreshToken = string.Empty,
                    RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(30)
                }
            };
        }

        public static List<UserProfile> SeedUserProfiles()
        {
            return new List<UserProfile>
            {
                new UserProfile
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                    PhotoData = null,
                    FullName = "John Doe",
                    Bio = "Software developer.",
                    ProfessionalSkill = "C#, .NET, SQL",
                    IndustryExperience = "5 years in software development",
                    AvailabilityData = 1, // Weekdays
                    UserGoal = "Become a senior developer",
                    SessionFrequency = 1, // Weekly
                    SessionDuration = 3, // 1 hour
                    LearningStyle = 1, // Visual
                    TeachingApproach = 1, // Có thể là 1: Default/Direct
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    CommunicationMethod = 1 // Video Call
                },
                new UserProfile
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    PhotoData = null,
                    FullName = "Jane Smith",
                    Bio = "Frontend engineer.",
                    ProfessionalSkill = "React, JavaScript, CSS",
                    IndustryExperience = "3 years in frontend development",
                    AvailabilityData = 2, // Weekends
                    UserGoal = "Master fullstack development",
                    SessionFrequency = 2, // Every two weeks
                    SessionDuration = 2, // 45 minutes
                    LearningStyle = 2, // Auditory
                    TeachingApproach = 2, // Có thể là 2: Default/Indirect
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    CommunicationMethod = 2 // Audio Call
                }
            };
        }
    }
}