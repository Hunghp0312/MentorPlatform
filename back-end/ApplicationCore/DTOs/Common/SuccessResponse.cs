using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApplicationCore.DTOs.Common
{
    public class SuccessResponse<T>
    {
        public required T data { get; set; }
        public required string message { get; set; }
    }
}
