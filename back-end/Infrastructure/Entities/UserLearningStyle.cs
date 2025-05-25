// filepath: d:\CSharp\Project\back-end\Infrastructure\Entities\UserLearningStyle.cs
using System;
using Infrastructure.Entities.Enum; // Added this using statement

namespace Infrastructure.Entities
{
    public class UserLearningStyle
    {
        public Guid UserId { get; set; }
        public virtual UserProfile User { get; set; } = null!;

        public int LearningStyleId { get; set; }
        public virtual LearningStyle LearningStyle { get; set; } = null!;
    }
}
