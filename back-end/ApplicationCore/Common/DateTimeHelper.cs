namespace ApplicationCore.Common
{
    public static class DateTimeHelper
    {
        private static readonly TimeZoneInfo VietnamTimeZone = GetVietnamTimeZoneInfo();

        public static DateTime GetCurrentVietnamTime()
        {
            return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, VietnamTimeZone);
        }

        private static TimeZoneInfo GetVietnamTimeZoneInfo()
        {
            try
            {
                return TimeZoneInfo.FindSystemTimeZoneById("Asia/Ho_Chi_Minh");
            }
            catch (TimeZoneNotFoundException)
            {
                return TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            }
        }
    }
}
