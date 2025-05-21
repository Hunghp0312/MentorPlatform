using Microsoft.AspNetCore.Mvc;

namespace Presentation.Configurations
{
    public static class ApiBehaviorConfiguration
    {
        public static void ConfigureApiBehavior(this IServiceCollection services)
        {
            services.Configure<ApiBehaviorOptions>(options =>
            {
                options.InvalidModelStateResponseFactory = context =>
                {
                    string errorMessage = "One or more validation errors occurred.";

                    var errorMessages = context.ModelState.Values
                                           .SelectMany(v => v.Errors)
                                           .Select(e => e.ErrorMessage)
                                           .Where(m => !string.IsNullOrEmpty(m))
                                           .ToList();

                    if (errorMessages.Any())
                    {
                        errorMessage = string.Join(" | ", errorMessages);
                    }

                    var errorResponse = new { message = errorMessage };
                    return new BadRequestObjectResult(errorResponse);
                };
            });
        }
    }
}
