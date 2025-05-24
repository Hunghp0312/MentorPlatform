using ApplicationCore.DTOs.Requests.Registration;
using ApplicationCore.Constants;
using FluentValidation;
using System.Linq;

namespace ApplicationCore.Validators
{
    public class SetPreferenceRequestValidator : AbstractValidator<SetPreferenceRequest>
    {
        // Assuming you might need to inject IUserRepository or similar to get User's Role for conditional validation.
        // For simplicity, this example doesn't directly inject it but shows how conditional validation would work.
        // In a real scenario, you might pass the user's role to the validator or fetch it if the validator has access to a repository.

        public SetPreferenceRequestValidator() // Potentially: IUserRepository userRepository, Guid userId (if passed to validator)
        {
            RuleFor(x => x.TopicOfInterestIds)
                .NotEmpty().WithMessage(ValidationMessages.TOPIC_OF_INTEREST_REQUIRED)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.TOPIC_OF_INTEREST_REQUIRED_ALMENO_UNO);

            RuleFor(x => x.SessionFrequencyId)
                .NotNull().WithMessage(ValidationMessages.SESSION_FREQUENCY_REQUIRED);

            RuleFor(x => x.SessionDurationId)
                .NotNull().WithMessage(ValidationMessages.SESSION_DURATION_REQUIRED);

            // Conditional validation for LearningStyleIds (only for Learners)
            // This requires knowing the user's role. The DTO itself doesn't have Role.
            // One way is to have a separate validator or pass role to this validator.
            // For now, let's assume if LearningStyleIds is provided, it should not be empty.
            // A more robust solution would involve checking the role from the user associated with the request.
            RuleFor(x => x.LearningStyleIds)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.LEARNING_STYLE_REQUIRED_ALMENO_UNO)
                .When(x => x.LearningStyleIds != null); // Only validate if provided. Role-based check would be better.
                // .WhenAsync(async (req, context, cancellation) => { 
                //    var user = await userRepository.GetByIdAsync(context.InstanceToValidate.UserId); // Assuming UserId is part of SetPreferenceRequest or context
                //    return user?.RoleId == 2; // 2 for Learner
                // });

            // Conditional validation for TeachingApproachIds (only for Mentors)
            RuleFor(x => x.TeachingApproachIds)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.TEACHING_APPROACH_REQUIRED_ALMENO_UNO)
                .When(x => x.TeachingApproachIds != null); // Only validate if provided. Role-based check would be better.
                // .WhenAsync(async (req, context, cancellation) => { 
                //    var user = await userRepository.GetByIdAsync(context.InstanceToValidate.UserId); // Assuming UserId is part of SetPreferenceRequest or context
                //    return user?.RoleId == 3; // 3 for Mentor
                // });

            // UserGoal is optional in SetPreferenceRequest, but if provided, validate its length.
            RuleFor(x => x.UserGoal)
                .MaximumLength(500).WithMessage(ValidationMessages.USER_GOAL_MAX_LENGTH)
                .When(x => !string.IsNullOrEmpty(x.UserGoal));

            // Privacy settings usually don't need complex validation beyond being boolean.
        }
    }
}
