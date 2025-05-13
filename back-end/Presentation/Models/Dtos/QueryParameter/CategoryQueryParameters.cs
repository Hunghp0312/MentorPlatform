using Presentation.Models.Dtos.Common;

namespace Presentation.Models.Dtos.QueryParameter
{
    public class CategoryQueryParameters : PaginationParameters
    {
        public string? Query { get; set; } // Search by category name
        public string? Status { get; set; } // Active or Inactive
    }
}