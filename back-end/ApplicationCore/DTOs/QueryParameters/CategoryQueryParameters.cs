using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class CategoryQueryParameters : PaginationParameters
    {
        public string? Status { get; set; }
    }
}