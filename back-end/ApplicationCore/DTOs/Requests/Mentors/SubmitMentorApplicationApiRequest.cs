using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class SubmitMentorApplicationApiRequest : BaseMentorApplicationApiRequest
    {
        public required IFormFile SupportingDocument { get; set; }
    }
}
