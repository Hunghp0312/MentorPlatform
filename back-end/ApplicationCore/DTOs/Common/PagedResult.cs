using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationCore.DTOs.Common
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>(); // Danh sách item trên trang hiện tại
        public int Page { get; set; } // Số trang hiện tại
        public int PageSize { get; set; } // Kích thước trang
        public int TotalItems { get; set; } // Tổng số item khớp với điều kiện lọc
        public int TotalPages { get; set; } // Tổng số trang

        public PagedResult(List<T> items, int page, int pageSize, int totalItems)
        {
            Items = items;
            Page = page;
            PageSize = pageSize;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        }
    }
}