namespace ApplicationCore.DTOs.Common
{
    public class PagedResult<T>
    {
        public required ICollection<T> Items { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }

        public int TotalPages => (int)Math.Ceiling(TotalItems / (double)PageSize);
    }
}