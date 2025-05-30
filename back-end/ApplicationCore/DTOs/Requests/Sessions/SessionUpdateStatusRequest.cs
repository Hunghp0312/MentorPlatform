namespace ApplicationCore.DTOs.Requests.Sessions
{
    public class SessionUpdateStatusRequest
    {
        public Guid UserId { get; set; }
        public Guid SessionId { get; set; }
        public int StatusId { get; set; }
    }
}