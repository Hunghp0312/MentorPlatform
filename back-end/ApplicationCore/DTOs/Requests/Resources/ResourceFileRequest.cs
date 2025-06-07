using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.Resources
{
    public class ResourceFileRequest
    {
        public IFormFile? file { get; set; }
    }
}
