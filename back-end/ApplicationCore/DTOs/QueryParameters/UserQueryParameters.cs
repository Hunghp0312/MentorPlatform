using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class UserQueryParameters : PaginationParameters
    {
        public int? RoleId { get; set; }
    }
}
