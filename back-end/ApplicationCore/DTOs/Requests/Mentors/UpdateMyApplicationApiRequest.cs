using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Mentors
{
    public class UpdateMyApplicationApiRequest : BaseMentorApplicationApiRequest
    {
        public IFormFile? SupportingDocument { get; set; }
    }
}
