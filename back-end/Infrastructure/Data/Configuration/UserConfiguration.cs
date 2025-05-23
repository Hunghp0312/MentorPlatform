using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Data.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.HasKey(u => u.Id);

            builder.Property(u => u.Email)
                .IsRequired()
                .HasMaxLength(255);
            builder.HasIndex(u => u.Email).IsUnique();

            builder.Property(u => u.PasswordHash)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(u => u.RoleId).IsRequired();

            builder.Property(u => u.PasswordResetToken)
                .IsRequired(false);

            builder.Property(u => u.PasswordResetExpiry).IsRequired(false);
            builder.Property(u => u.LastLogin).IsRequired(false);

            builder.Property(u => u.RefreshToken).IsRequired(false);
            builder.Property(u => u.RefreshTokenExpiryTime).IsRequired(false);

            builder.HasData(
                new User
                {
                    Id = Guid.Parse("148b5a81-90d6-476d-9fee-747b834011ee"),
                    Email = "huynguyen.admin@gmail.com",
                    PasswordHash = "J24qoemyIGuKyAln3/Pi8RE91q37SzIJG73mRFp3NZdqEIACwi8kt+zwc2H83LoW",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                    Email = "huykhuong.admin@gmail.com",
                    PasswordHash = "MEO5BmXN7sVmKAnTj2gETwED6W21cDTnsB2r9wir+fLFKTHRsmuDEnA134c8XS7g",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                    Email = "minhchau.admin@gmail.com",
                    PasswordHash = "mx31ZEfKpYBolnpQdU24oZr6J8rgcmeekox8OBXQjETbsl4JcFqFbX6VwbrRUngk",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                    Email = "huynguyen.learner@gmail.com",
                    PasswordHash = "V5ValFHZWsVzHsJ1/kVQNY7voa9/s82t0wCoXgKANAmUV7jIXB3fSDqPrEWXyDQE",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                    Email = "huykhuong.learner@gmail.com",
                    PasswordHash = "ij89QzFzzSDgkoM4/BxIQP/XGsF+jpIqE9jCQ54glK+RtGhTwWNA+tAgoq+VvcWP",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                    Email = "minhchau.learner@gmail.com",
                    PasswordHash = "PrMl19R6c0HX1trcVn7rrzICN0cwn9dfaVqYRy5MKE2ooPNFDCkNvOi3eYFQ+t3Y",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"),
                    Email = "huynguyen.mentor@gmail.com",
                    PasswordHash = "S5oA4POvzUKSeBQTJCs3YrB7T6reeQXFhqLhq9FVjt8iPCwLLijsfrdYVKZDjYaU",
                    RoleId = 3,
                }, new User
                {
                    Id = Guid.Parse("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                    Email = "huykhuong.mentor@gmail.com",
                    PasswordHash = "cfvPgZ274jQi71+hIv9qWL1GW4fl8c1krVlChe4zfN/W1GWQ+iI7hVe6acsAVs4r",
                    RoleId = 3,
                }, new User
                {
                    Id = Guid.Parse("862b702e-2c59-46f7-8c06-5349d769e237"),
                    Email = "minhchau.mentor@gmail.com",
                    PasswordHash = "JusmH4xgMpPCqpXoHUmy5gIrmPE8Tn3FnmL4oJwoo5pdSUihid8bh2A8X47pDT0p",
                    RoleId = 3,

                }, new User
                {
                    Id = Guid.Parse("0dd85da0-9214-419e-aa02-adefac68c264"),
                    Email = "dancega713@gmail.com",
                    PasswordHash = "r0e+UhrOsii3FlfUcY8OKkdRK1bc5komYpbONiqqJYj6qD78uz9oc+1XH+3IiEZw",
                    RoleId = 2,
                });

        }
    }

}
