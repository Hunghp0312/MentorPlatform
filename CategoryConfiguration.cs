using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Library_API_2._0.Domain.Entities
{
    public class CategoryConfiguration : IEntityTypeConfiguration<Category>
    {
        public void Configure(EntityTypeBuilder<Category> builder)
        {
            builder.ToTable("Category");

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(100);
            builder.Property(c => c.Description)
                .IsRequired()
                .HasMaxLength(1000);
            builder.Property(c => c.Status)
                .IsRequired();

            builder.HasMany(c => c.Courses)
                .WithOne(c => c.< Category >)// c.Category
                .HasForeignKey(c => c.< CategoryId >)// c.CategoryId
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}