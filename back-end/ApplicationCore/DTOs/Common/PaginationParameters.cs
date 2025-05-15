namespace ApplicationCore.DTOs.Common
{
    public class PaginationParameters
    {
        private const int MaxPageSize = 20;
        private int _pageSize = 10; // Kích thước trang mặc định cho reviews

        public int Page { get; set; } = 1;

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize || value <= 0) ? MaxPageSize : value; // Giới hạn hợp lệ
        }
    }
}