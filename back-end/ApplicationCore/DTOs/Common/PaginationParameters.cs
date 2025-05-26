namespace ApplicationCore.DTOs.Common
{
    public class PaginationParameters
    {
        public string? Query { get; set; }
        private const int MaxPageSize = 20;
        private int _pageSize = 10;
        private int _pageIndex = 1;

        public int PageIndex
        {
            get => _pageIndex;
            set => _pageIndex = value < 1 ? _pageIndex : value;
        }

        public int PageSize
        {
            get => _pageSize;
            set
            {
                if (value > MaxPageSize)
                {
                    _pageSize = MaxPageSize;
                }
                else if (value < 1)
                {
                    _pageSize = 10;
                }
                else
                {
                    _pageSize = value;
                }
            }
        }
    }
}
