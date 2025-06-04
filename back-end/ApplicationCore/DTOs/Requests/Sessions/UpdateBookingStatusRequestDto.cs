namespace ApplicationCore.DTOs.Requests.Sessions
{
    public class UpdateBookingStatusRequestDto
    {
        public int NewStatusId { get; set; }
        public string? CancelReason { get; set; }
    }
}
