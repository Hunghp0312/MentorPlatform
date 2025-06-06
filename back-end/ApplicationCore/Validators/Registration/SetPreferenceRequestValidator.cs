using ApplicationCore.Constants;
using ApplicationCore.DTOs.Requests.Registration;
using FluentValidation;


namespace ApplicationCore.Validators
{
    public class SetPreferenceRequestValidator : AbstractValidator<SetPreferenceRequest>
    {
        public SetPreferenceRequestValidator()
        {
            RuleFor(x => x.TopicOfInterestIds)
                .NotEmpty().WithMessage(ValidationMessages.TOPIC_OF_INTEREST_REQUIRED)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.TOPIC_OF_INTEREST_AT_LEAST_ONE_REQUIRED)
                .ForEach(rule =>
                {
                    rule.Must(id => id > 0).WithMessage("Topic of interest ID must be positive.");
                })
                .When(x => x.TopicOfInterestIds != null && x.TopicOfInterestIds.Any());

            RuleFor(x => x.SessionFrequencyId)
                .NotEmpty().WithMessage(ValidationMessages.SESSION_FREQUENCY_REQUIRED)
                .GreaterThan(0).WithMessage("Session frequency ID must be positive.")
                .When(x => x.SessionFrequencyId.HasValue);

            RuleFor(x => x.SessionDurationId)
                .NotEmpty().WithMessage(ValidationMessages.SESSION_DURATION_REQUIRED)
                .GreaterThan(0).WithMessage("Session duration ID must be positive.")
                .When(x => x.SessionDurationId.HasValue);


            RuleFor(x => x.LearningStyleIds)
                .NotEmpty().WithMessage(ValidationMessages.LEARNING_STYLE_AT_LEAST_ONE_REQUIRED)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.LEARNING_STYLE_AT_LEAST_ONE_REQUIRED)
                .ForEach(rule =>
                {
                    rule.Must(id => id > 0).WithMessage("Learning style ID must be positive.");
                })
                .When(x => x.LearningStyleIds != null && x.LearningStyleIds.Any());


            RuleFor(x => x.TeachingApproachIds)
                .NotEmpty().WithMessage(ValidationMessages.TEACHING_APPROACH_AT_LEAST_ONE_REQUIRED)
                .Must(ids => ids != null && ids.Any()).WithMessage(ValidationMessages.TEACHING_APPROACH_AT_LEAST_ONE_REQUIRED)
                .ForEach(rule =>
                {
                    rule.Must(id => id > 0).WithMessage("Teaching approach ID must be positive.");
                })
                .When(x => x.TeachingApproachIds != null && x.TeachingApproachIds.Any());
        }
    }
}
