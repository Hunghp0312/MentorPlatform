namespace Infrastructure.Entities;

public class LearnerCourse
{
    public Guid LearnerId { get; set; }
    public User? Learner { get; set; }
    public Guid CourseId { get; set; }
    public Course? Course { get; set; }
    public DateTime EnrolledAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public bool IsCompleted { get; set; } = false;
}
