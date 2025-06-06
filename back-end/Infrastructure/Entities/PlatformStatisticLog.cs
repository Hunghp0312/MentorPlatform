namespace Infrastructure.Entities
{
    public class PlatformStatisticLog
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; }
        public double MentorRetention { get; set; }
        public double ResourceDownload { get; set; }
        public int NewUsers30d { get; set; }
    }
}