using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class ApplicationStatusConfiguration : BaseTypeConfiguration<ApplicationStatus>
    {
        public override void Configure(EntityTypeBuilder<ApplicationStatus> builder)
        {
            base.Configure(builder);
            builder.HasData(
              new ApplicationStatus { Id = 1, Name = "Pending" },
              new ApplicationStatus { Id = 2, Name = "Rejected" },
              new ApplicationStatus { Id = 3, Name = "Approved" },
              new ApplicationStatus { Id = 4, Name = "Request Info" },
              new ApplicationStatus { Id = 5, Name = "Submited" },
              new ApplicationStatus { Id = 6, Name = "Under Review" }
          );
        }
    }
}