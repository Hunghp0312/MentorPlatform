using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationCore.DTOs.Requests.Resources
{
    public class AddResourceRequest
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public Guid CourseId { get; set; }
        public int ResourceCategoryId { get; set; }
        public int TypeOfResourceId { get; set; }
    }
}