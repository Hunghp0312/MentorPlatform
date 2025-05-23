namespace ApplicationCore.Constants
{
    public static class ValidationMessages
    {
        public const string MaxFilesExceeded = "You can upload a maximum of {MaxFiles} files.";
        public const string MaxLengthExceeded = "{PropertyName} must not exceed {MaxLength} characters.";
        public const string FileCannotBeEmpty = "Uploaded file cannot be empty.";
        public const string FieldRequired = "{PropertyName} is required and cannot be empty.";
        public const string CategoryNameRequired = "Category name is required and cannot be empty.";
        public const string CategoryNameMaxLength = "Category name must not exceed 100 characters.";
        public const string CategoryDescriptionRequired = "Description is required and cannot be empty.";
        public const string CategoryDescriptionMaxLength = "Description must not exceed 1000 characters.";
        public const string CategoryStatusInvalid = "Invalid category status value.";

        public const string EducationDetailsRequired = "Education details are required.";
        public const string WorkExperienceDetailsRequired = "Work experience details are required.";
        public const string CertificationsRequired = "Certifications are required.";

        // --- Mentor Application ---
        public const string SupportingDocumentRequired = "A supporting document is required.";
        public const string FileTooLarge = "The file size must not exceed {MaxSizeInMB} MB.";
        public const string InvalidFileType = "Invalid file type. Allowed types are: {AllowedTypes}.";
        public const string FileNameTooLong = "File name must not exceed 255 characters.";

        // --- EducationDetailDto ---
        public const string InstitutionNameRequired = "Institution name is required.";
        public const string DegreeRequired = "Degree is required.";
        public const string FieldOfStudyRequired = "Field of study is required.";
        public const string GraduationYearInvalid = "Graduation year must be a valid year.";
        public const string GraduationYearRange = "{PropertyName} must be between {From} and {To}.";

        // --- WorkExperienceDetailDto ---
        public const string CompanyNameRequired = "Company name is required.";
        public const string PositionRequired = "Position is required.";
        public const string StartDateRequired = "Start date is required.";
        public const string EndDateAfterStartDate = "End date must be after start date.";

        // --- CertificationDetailDto ---
        public const string CertificationNameRequired = "Certification name is required.";
        public const string IssuingOrganizationRequired = "Issuing organization is required.";
        public const string CredentialUrlInvalid = "Credential URL is not a valid URL.";
    }
}
