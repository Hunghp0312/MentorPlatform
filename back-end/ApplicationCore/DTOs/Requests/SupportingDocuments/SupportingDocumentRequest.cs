using Microsoft.AspNetCore.Http;

namespace ApplicationCore.DTOs.Requests.SupportingDocuments
{
    public class SupportingDocumentRequest
    {
        public IFormFile? file { get; set; }
    }
}
