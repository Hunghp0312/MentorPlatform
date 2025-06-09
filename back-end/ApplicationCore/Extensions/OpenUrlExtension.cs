using System.Diagnostics;
using System.Runtime.InteropServices;

namespace ApplicationCore.Extensions
{
    public static class OpenUrlExtension
    {
        public static void OpenUrl(string url)
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                // Windows
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
        }
    }
}