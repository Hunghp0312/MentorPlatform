namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class ApplicationStatusCountResponse
    {
        public int Pending { get; set; }
        public int Approved { get; set; }
        public int Rejected { get; set; }
        public int RequestInfo { get; set; }
    }
}