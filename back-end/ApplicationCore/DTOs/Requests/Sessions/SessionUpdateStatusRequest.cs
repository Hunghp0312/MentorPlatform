namespace ApplicationCore.DTOs.Requests.Sessions
{
    public class SessionUpdateStatusRequest
    {
        public Guid MentorId { get; set; }
        public Guid SessionId { get; set; }
        public int StatusId { get; set; }
    }
}