using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class CategoryQueryParameters : PaginationParameters
    {
        public string? Query { get; set; } // Search by category name
        public string? Status { get; set; } // Active or Inactive
    }
}