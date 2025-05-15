using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationCore.DTOs.Common
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public PagedResult(List<T> items, int page, int pageSize, int totalItems)
        {
            Items = items;
            PageIndex = page;
            PageSize = pageSize;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
        }
    }
}
