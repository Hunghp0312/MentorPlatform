using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class MentorTimeAvailableSeeding
    {
        public static List<MentorTimeAvailable> SeedMentorTimeAvailable()
        {
            var availableStatus = 1;
            var bookedStatus = 2;

            var day1Id = Guid.Parse("DA331A4B-3665-4D78-99A6-825DA4015E76");
            var day2Id = Guid.Parse("4A6E7525-23E4-4D6F-930B-22F2E40783D9");
            var day3Id = Guid.Parse("F4E2B81E-479A-4B6A-8A4D-08D3E4C8A6B0");

            return new List<MentorTimeAvailable>
            {
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(9, 0),
                    End = new TimeOnly(9, 30),
                    DayId = day1Id,
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(9, 30),
                    End = new TimeOnly(10, 0),
                    DayId = day1Id,
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(14, 30),
                    DayId = day2Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                    Start = new TimeOnly(14, 30),
                    End = new TimeOnly(15, 0),
                    DayId = day2Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                    Start = new TimeOnly(10, 0),
                    End = new TimeOnly(10, 30),
                    DayId = day3Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                    Start = new TimeOnly(10, 30),
                    End = new TimeOnly(11, 0),
                    DayId = day3Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                    Start = new TimeOnly(1, 0),
                    End = new TimeOnly(2, 0),
                    DayId = Guid.Parse("9E8D7C6B-5A4B-3C2D-1E0F-A9B8C7D6E5F4"),
                    StatusId = bookedStatus,
                },
            };
        }
    }
}
