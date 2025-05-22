using Microsoft.AspNetCore.Http;

namespace ApplicationCore.Common
{
    public static class FileHelper
    {
        public static async Task<byte[]> ToByteArrayAsync(this IFormFile file)
        {
            using (var ms = new MemoryStream())
            {
                await file.CopyToAsync(ms);
                return ms.ToArray();
            }
        }
    }
}