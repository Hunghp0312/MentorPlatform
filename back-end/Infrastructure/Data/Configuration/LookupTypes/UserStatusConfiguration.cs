
using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class UserStatusConfiguration : BaseTypeConfiguration<UserStatus>
    {
        public override void Configure(EntityTypeBuilder<UserStatus> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new UserStatus { Id = 1, Name = "Active" },
                new UserStatus { Id = 2, Name = "Pending" },
                new UserStatus { Id = 3, Name = "Deactivated" }
            );
        }
    }
}