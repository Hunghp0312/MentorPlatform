namespace ApplicationCore.DTOs.Common
{
    public class SuccessResponse<T>
    {
        public required T Data { get; set; }
    }
}
