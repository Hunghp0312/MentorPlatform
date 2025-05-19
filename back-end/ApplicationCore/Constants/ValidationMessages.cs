namespace ApplicationCore.Constants
{
    public static class ValidationMessages
    {
        public const string CategoryNameRequired = "Category name is required and cannot be empty.";
        public const string CategoryNameMaxLength = "Category name must not exceed 100 characters.";
        public const string CategoryDescriptionRequired = "Description is required and cannot be empty.";
        public const string CategoryDescriptionMaxLength = "Description must not exceed 1000 characters.";
        public const string CategoryStatusInvalid = "Invalid category status value.";
    }
}
