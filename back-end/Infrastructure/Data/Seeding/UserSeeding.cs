using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding;

public static class UserSeeding
{
    public static List<User> SeedUsers()
    {
        return new List<User>{
                new User
                {
                    Id = Guid.Parse("148b5a81-90d6-476d-9fee-747b834011ee"),
                    Email = "huynguyen.admin@gmail.com",
                    PasswordHash = "4CojI/ZvEQrJoJShTol0qRKe7e2405PVU3hFGnrjR0aDrWVa3D7eNC3WhLJkK26I",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                    Email = "huykhuong.admin@gmail.com",
                    PasswordHash = "/+9ouySHkK9R7JdK3pa7U54juoLGcDiqYx2POg1X3bZLkBvw0FVDzkFMUD+Vmc+E",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                    Email = "minhchau.admin@gmail.com",
                    PasswordHash = "7ZpVU6DoVE+e0Op1dI8PIvL4VVOQimwEZdUZskBB0plT1CmAP/y+SRsT9WSZudW8",
                    RoleId = 1,
                },
                new User
                {
                    Id = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                    Email = "huynguyen.learner@gmail.com",
                    PasswordHash = "B/Rx/lR+MNs1oWANBFYVwZXSd2hFKDhpk0By7MEg7K3ecpz9LwQBZiUv07/TkqVu",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                    Email = "huykhuong.learner@gmail.com",
                    PasswordHash = "odpdHFLV8lFXrpiHJJtYd0npiynudyI824s0lciPT5yBap7SDcMWGHCmAXoPtRyi",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                    Email = "minhchau.learner@gmail.com",
                    PasswordHash = "d9G9m3ndZwGLV5ciCqHMDRGslR0k1znhgJiPFvN33VyVNYSIeREzLj9Qgtk4m4TT",
                    RoleId = 2,
                }, new User
                {
                    Id = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"),
                    Email = "huynguyen.mentor@gmail.com",
                    PasswordHash = "ZKZIjsIEcJZT88GTD+nT3l+vwBZH/mla4b5WiSYufGWiOAbvBqnoRNZQjM6qsaqq",
                    RoleId = 3,
                }, new User
                {
                    Id = Guid.Parse("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                    Email = "huykhuong.mentor@gmail.com",
                    PasswordHash = "kj0QXVpwv8AjYwrfB+FPVaxCzfziTAXK32tqjdoPoc82UNhIxrkXB+2NSkaAr5AV",
                    RoleId = 3,
                }, new User
                {
                    Id = Guid.Parse("862b702e-2c59-46f7-8c06-5349d769e237"),
                    Email = "minhchau.mentor@gmail.com",
                    PasswordHash = "dhkox+ORaHABdxUb6ihukuIpaSWTQOhgaObuiH3yr7E7WpX+vCJOH1PBlc5RbhQr",
                    RoleId = 3,

                }, new User
                {
                    Id = Guid.Parse("0dd85da0-9214-419e-aa02-adefac68c264"),
                    Email = "dancega713@gmail.com",
                    PasswordHash = "r0e+UhrOsii3FlfUcY8OKkdRK1bc5komYpbONiqqJYj6qD78uz9oc+1XH+3IiEZw",
                    RoleId = 2,
                }
        };
    }
}
