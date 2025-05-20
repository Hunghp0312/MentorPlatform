namespace ApplicationCore.DTOs.Common
{
    public class BaseResponse
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public required string Description { get; set; }
    }
}