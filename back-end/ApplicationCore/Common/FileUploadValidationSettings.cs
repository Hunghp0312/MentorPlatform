namespace ApplicationCore.Common
{
    public static class FileUploadConstants
    {
        public const long MaxFileSizeInBytes = 5 * 1024 * 1024;
        public static readonly string[] AllowedFileTypes =
        {
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        };
        public static long MaxFileSizeInMB => MaxFileSizeInBytes / 1024 / 1024;
    }
}
