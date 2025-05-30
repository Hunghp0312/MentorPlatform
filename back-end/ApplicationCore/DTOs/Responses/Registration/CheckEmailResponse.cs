namespace ApplicationCore.DTOs.Responses.Registration
{
    public class CheckEmailResponse
    {
        public bool Exists { get; set; }
        public string? Message { get; set; } // Optional: to provide more context
    }
}
