namespace ApplicationCore.DTOs.Common
{
    public class PaginationParameters
    {
        private const int MaxPageSize = 20;
        private int _pageSize = 10; // Kích thước trang mặc định cho reviews

        private int _pageIndex = 1;

        public int PageIndex
        {
            get => _pageIndex;
            set => _pageIndex = value < 1 ? _pageIndex : value;
        }

        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : (value < 1) ? _pageSize : value; // Giới hạn hợp lệ
        }
    }
}