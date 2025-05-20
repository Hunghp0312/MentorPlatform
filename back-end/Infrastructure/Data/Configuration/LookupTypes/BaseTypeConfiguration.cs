using Infrastructure.Entities.Enum;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration.LookupTypes
{
    public class BaseTypeConfiguration<T> : IEntityTypeConfiguration<T>
        where T : EnumType
    {
        public virtual void Configure(EntityTypeBuilder<T> builder)
        {
            builder.ToTable(typeof(T).Name);

            builder.HasKey(c => c.Id);

            builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        }
    }
}
