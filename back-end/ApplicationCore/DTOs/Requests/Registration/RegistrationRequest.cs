namespace ApplicationCore.DTOs.Requests.Registration
{
    public class RegistrationRequest
    {
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string ConfirmPassword { get; set; }
        public bool TermsAccepted { get; set; }
    }
}