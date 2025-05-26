namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class MentorUpdateStatusRequest
    {
        public Guid MentorId { get; set; }
        public int StatusId { get; set; }
        public string? AdminComments { get; set; }
        public Guid? AdminReviewerId { get; set; }
        
    }
}