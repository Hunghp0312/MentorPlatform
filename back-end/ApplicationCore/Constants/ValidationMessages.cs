namespace ApplicationCore.Constants
{
    public static class ValidationMessages
    {
        public const string MaxLengthExceeded =
            "{PropertyName} must not exceed {MaxLength} characters.";
        public const string MaxFilesExceeded = "You can upload a maximum of {MaxFiles} files.";
        public const string FileCannotBeEmpty = "Uploaded file cannot be empty.";
        public const string FieldRequired = "{PropertyName} is required and cannot be empty.";
        public const string CategoryNameRequired = "Category name is required and cannot be empty.";
        public const string CategoryNameMaxLength = "Category name must not exceed 100 characters.";
        public const string CategoryDescriptionRequired =
            "Description is required and cannot be empty.";
        public const string CategoryDescriptionMaxLength =
            "Description must not exceed 1000 characters.";
        public const string CategoryStatusInvalid = "Invalid category status value.";
        public const string CourseNameRequired = "Course name is required and cannot be empty.";
        public const string CourseNameMaxLength = "Course name must not exceed 100 characters.";
        public const string CourseDescriptionRequired =
            "Course description is required and cannot be empty.";
        public const string CourseDescriptionMaxLength =
            "Course description must not exceed 1000 characters.";
        public const string CourseDurationRequired =
            "Course duration is required and cannot be empty.";
        public const string CourseDurationMinLength =
            "Course duration must be at least 6 characters.";
        public const string CourseDurationMaxLength =
            "Course duration must not exceed 100 characters.";
        public const string CourseTagRequired = "Course tag is required and cannot be empty.";
        public const string CourseTagMaxLength = "Course tag must not exceed 50 characters.";
        public const string CourseTagDuplicate = "Course tags must be unique.";
        public const string CourseCategoryInvalid = "Invalid course category.";
        public const string CourseStatusInvalid = "Invalid course status.";
        public const string CourseLevelInvalid = "Invalid course level.";
        public const string EducationDetailsRequired = "Education details are required.";
        public const string WorkExperienceDetailsRequired = "Work experience details are required.";
        public const string CertificationsRequired = "Certifications are required.";
        public const string SupportingDocumentRequired = "A supporting document is required.";
        public const string FileTooLarge = "The file size must not exceed {MaxSizeInMB} MB.";
        public const string InvalidFileType =
            "Invalid file type. Allowed types are: {AllowedTypes}.";
        public const string FileNameTooLong = "File name must not exceed 255 characters.";
        public const string InstitutionNameRequired = "Institution name is required.";
        public const string DegreeRequired = "Degree is required.";
        public const string FieldOfStudyRequired = "Field of study is required.";
        public const string GraduationYearInvalid = "Graduation year must be a valid year.";
        public const string GraduationYearRange = "{PropertyName} must be between {From} and {To}.";
        public const string CompanyNameRequired = "Company name is required.";
        public const string PositionRequired = "Position is required.";
        public const string StartDateRequired = "Start date is required.";
        public const string EndDateAfterStartDate = "End date must be after start date.";
        public const string StartDateEqualOrBeforeCurrentDate = "Start date must be equal current date or before.";
        public const string CertificationNameRequired = "Certification name is required.";
        public const string IssuingOrganizationRequired = "Issuing organization is required.";
        public const string CredentialUrlInvalid = "Credential URL is not a valid URL.";
        public const string EMAIL_REQUIRED = "Email is required.";
        public const string EMAIL_INVALID_FORMAT = "Email format is invalid.";
        public const string PASSWORD_REQUIRED = "Password is required.";
        public const string PASSWORD_MIN_LENGTH = "Password must be at least 8 characters long.";
        public const string PASSWORD_LETTER_REQUIRED = "Password must contain at least one letter.";
        public const string PASSWORD_DIGIT_REQUIRED = "Password must contain at least one digit.";
        public const string PASSWORD_SPECIAL_CHAR_REQUIRED =
            "Password must contain at least one special character.";
        public const string CONFIRM_PASSWORD_NOT_MATCH =
            "Confirm password does not match password.";
        public const string ROLE_REQUIRED = "Role is required.";
        public const string ROLE_INVALID = "Invalid role selected. Must be 'Learner' or 'Mentor'.";
        public const string FULL_NAME_REQUIRED = "Full name is required.";
        public const string FULL_NAME_MAX_LENGTH = "Full name must not exceed 100 characters.";

        public const string PHONE_NUMBER_INVALID_FORMAT =
            "Phone number must be in a valid format (e.g., +1234567890).";
        public const string PHONE_NUMBER_MAX_LENGTH = "Phone number must not exceed 15 characters.";
        public const string BIO_MAX_LENGTH = "Bio must not exceed 500 characters.";
        public const string PHOTO_REQUIRED = "Photo is required.";
        public const string EXPERTISE_AREAS_INVALID_FORMAT =
            "Expertise areas must be a list of non-empty strings.";
        public const string PROFESSIONAL_SKILL_REQUIRED =
            "Professional skill is required for mentors.";
        public const string PROFESSIONAL_SKILL_MAX_LENGTH =
            "Professional skill must not exceed 200 characters.";
        public const string INDUSTRY_EXPERIENCE_REQUIRED =
            "Industry experience is required for mentors.";
        public const string INDUSTRY_EXPERIENCE_MAX_LENGTH =
            "Industry experience must not exceed 200 characters.";
        public const string AVAILABILITY_REQUIRED = "Availability is required.";
        public const string AVAILABILITY_AT_LEAST_ONE_REQUIRED =
            "At least one availability slot must be selected.";
        public const string COMMUNICATION_METHODS_REQUIRED = "Communication methods are required.";
        public const string COMMUNICATION_METHODS_AT_LEAST_ONE_REQUIRED =
            "At least one communication method must be selected.";
        public const string USER_GOAL_REQUIRED = "User goal is required.";
        public const string USER_GOAL_MAX_LENGTH = "User goal must not exceed 500 characters.";
        public const string ROLE_INVALID_SELECTION =
            "Selected role must be either Learner or Mentor.";
        public const string TOPIC_OF_INTEREST_REQUIRED = "Topics of interest are required.";
        public const string TOPIC_OF_INTEREST_AT_LEAST_ONE_REQUIRED =
            "At least one topic of interest must be selected.";
        public const string SESSION_FREQUENCY_REQUIRED = "Session frequency is required.";
        public const string SESSION_DURATION_REQUIRED = "Session duration is required.";
        public const string LEARNING_STYLE_AT_LEAST_ONE_REQUIRED =
            "At least one learning style must be selected for learners.";
        public const string TEACHING_APPROACH_AT_LEAST_ONE_REQUIRED =
            "At least one teaching approach must be selected for mentors.";

        // Schedule Configuration Validation Messages
        public const string WorkDayStartTimeRequired = "Work day start time is required.";
        public const string WorkDayEndTimeRequired = "Work day end time is required.";
        public const string InvalidTimeFormat = "Invalid time format. Please use HH:mm (24-hour format).";
        public const string EndTimeAfterStartTime = "Work day end time must be after start time."; // For custom validation
        public const string SessionDurationRequired = "Session duration is required.";
        public const string SessionDurationMin = "Session duration must be at least 15 minutes.";
        public const string BufferTimeRequired = "Buffer time is required.";
        public const string BufferTimeMin = "Buffer time must be at least 0 minutes.";
        public const string CONFLICT_EXISTING_BOOKED_SESSIONS = "Cannot update schedule due to existing booked or pending sessions in the future.";
    }
}
