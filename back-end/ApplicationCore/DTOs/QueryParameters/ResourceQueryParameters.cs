using ApplicationCore.DTOs.Common;

namespace ApplicationCore.DTOs.QueryParameters
{
    public class ResourceQueryParameters : PaginationParameters
    {
        public int? TypeOfResourceId { get; set; }
    }
}