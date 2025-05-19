namespace ApplicationCore.DTOs.Common
{
    public class SuccessResponse<T>
    {
        public required T data { get; set; }
        public required string message { get; set; }
    }
}
