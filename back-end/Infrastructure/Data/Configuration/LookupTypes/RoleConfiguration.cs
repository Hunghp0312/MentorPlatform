using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class RoleConfiguration : BaseTypeConfiguration<Role>
    {
        public override void Configure(EntityTypeBuilder<Role> builder)
        {
            base.Configure(builder);

            builder.HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Learner" },
                new Role { Id = 3, Name = "Mentor" }
            );
        }
    }
}
