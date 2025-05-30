namespace Infrastructure.Entities
{
    public class MentorDayAvailable
    {
        public Guid Id { get; set; }
        public Guid MentorId { get; set; }
        public virtual User Mentor { get; set; } = null!;
        public DateOnly Day { get; set; }
        public TimeOnly StartWorkTime { get; set; }
        public TimeOnly EndWorkTime { get; set; }
        public TimeOnly SessionDuration { get; set; }
        public TimeOnly BufferTime { get; set; }
        public virtual ICollection<MentorTimeAvailable> MentorTimeAvailables { get; set; } =
            new List<MentorTimeAvailable>();
    }
}
