using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class UserQueryParameters : PaginationParameters
    {
        public int? RoleId { get; set; }
        public string? Status { get; set; }
        public string? SearchQuery { get; set; }
    }
}
