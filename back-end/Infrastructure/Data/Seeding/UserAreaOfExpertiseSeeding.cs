using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class UserAreaOfExpertiseSeeding
    {
        public static List<UserAreaOfExpertise> SeedUserAreasOfExpertise()
        {
            return new List<UserAreaOfExpertise>
            {

                new UserAreaOfExpertise { UserId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"), AreaOfExpertiseId = 2 },
                new UserAreaOfExpertise { UserId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"), AreaOfExpertiseId = 5 },
                new UserAreaOfExpertise { UserId = Guid.Parse("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), AreaOfExpertiseId = 3 },
                new UserAreaOfExpertise { UserId = Guid.Parse("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"), AreaOfExpertiseId = 4 },
                new UserAreaOfExpertise { UserId = Guid.Parse("f75ff929-94dd-4d03-b1dd-c0f75e70df10"), AreaOfExpertiseId = 5 },
                new UserAreaOfExpertise { UserId = Guid.Parse("0dd85da0-9214-419e-aa02-adefac68c264"), AreaOfExpertiseId = 2 },

                new UserAreaOfExpertise { UserId = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"), AreaOfExpertiseId = 1 },
                new UserAreaOfExpertise { UserId = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"), AreaOfExpertiseId = 7 },
                new UserAreaOfExpertise { UserId = Guid.Parse("b1c97b14-fc84-4db5-899d-ae4a38996b56"), AreaOfExpertiseId = 2 },
                new UserAreaOfExpertise { UserId = Guid.Parse("b1c97b14-fc84-4db5-899d-ae4a38996b56"), AreaOfExpertiseId = 8 },
                new UserAreaOfExpertise { UserId = Guid.Parse("862b702e-2c59-46f7-8c06-5349d769e237"), AreaOfExpertiseId = 3 },
                new UserAreaOfExpertise { UserId = Guid.Parse("862b702e-2c59-46f7-8c06-5349d769e237"), AreaOfExpertiseId = 6 }
            };
        }
    }
}