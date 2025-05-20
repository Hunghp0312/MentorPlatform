namespace ApplicationCore.Common
{
    public static class TagHelper
    {
        private const char Delimiter = ',';

        public static string ConvertListToString(List<string> tags)
        {
            if (tags == null || tags.Count == 0)
                return string.Empty;

            return string.Join(Delimiter, tags);
        }

        public static List<string> ConvertStringToList(string tagsString)
        {
            if (string.IsNullOrWhiteSpace(tagsString))
                return [];

            return tagsString
                .Split(Delimiter, StringSplitOptions.RemoveEmptyEntries)
                .Select(tag => tag.Trim())
                .ToList();
        }
    }
}
