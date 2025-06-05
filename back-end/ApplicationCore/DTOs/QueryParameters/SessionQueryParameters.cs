using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class SessionQueryParameters : PaginationParameters
    {
        public int? StatusId { get; set; }
    }
}