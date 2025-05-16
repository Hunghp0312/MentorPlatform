namespace ApplicationCore.DTOs.Category
{
    public class CategoryPagedRequest
    {
        public string? Query { get; set; } // Search by category name
        public string? Status { get; set; } // Active or Inactive
        public int PageIndex { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}