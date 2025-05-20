namespace ApplicationCore.Constants
{
    public static class ValidationMessages
    {
        public const string CategoryNameRequired = "Category name is required and cannot be empty.";
        public const string CategoryNameMaxLength = "Category name must not exceed 100 characters.";
        public const string CategoryDescriptionRequired = "Description is required and cannot be empty.";
        public const string CategoryDescriptionMaxLength = "Description must not exceed 1000 characters.";
        public const string CategoryStatusInvalid = "Invalid category status value.";
        public const string CourseTitleRequired = "Course title is required and cannot be empty.";
        public const string CourseTitleMaxLength = "Course title must not exceed 100 characters.";
        public const string CourseDescriptionRequired = "Course description is required and cannot be empty.";
        public const string CourseDescriptionMaxLength = "Course description must not exceed 1000 characters.";
        public const string CourseCategoryRequired = "Course category is required and cannot be empty.";
        public const string CourseCategoryInvalid = "Invalid course category.";
        public const string CourseStatusInvalid = "Invalid course status value.";
        public const string CourseLevelInvalid = "Invalid course level value.";
        public const string CourseDurationRequired = "Course duration is required and cannot be empty.";
        public const string CourseDurationMinLength = "Course duration must be at least 6 characters.";
        public const string CourseDurationMaxLength = "Course duration must not exceed 100 characters.";
        public const string CourseTagRequired = "Course tag is required and cannot be empty.";
        public const string CourseTagMaxLength = "Course tag must not exceed 50 characters.";
        public const string CourseTagDuplicate = "Course tags must be unique.";
    }
}
