using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class MentorTimeAvailableSeeding
    {
        public static List<MentorTimeAvailable> SeedMentorTimeAvailable()
        {
            var availableStatus = 1;
            var bookedStatus = 2;

            // Existing days
            var day1Id = Guid.Parse("DA331A4B-3665-4D78-99A6-825DA4015E76");
            var day2Id = Guid.Parse("4A6E7525-23E4-4D6F-930B-22F2E40783D9");
            var day3Id = Guid.Parse("F4E2B81E-479A-4B6A-8A4D-08D3E4C8A6B0");

            // New days for June 11 to 15, 2025
            var day4Id = Guid.Parse("B3C4D5E6-F7A8-49B9-C0D1-2E3F4A5B6C7D"); // 2025-06-11
            var day5Id = Guid.Parse("C4D5E6F7-A8B9-40C1-D2E3-F4A5B6C7D8E9"); // 2025-06-12
            var day6Id = Guid.Parse("D5E6F7A8-B9C0-41D2-E3F4-A5B6C7D8E9F0"); // 2025-06-13
            var day7Id = Guid.Parse("E6F7A8B9-C0D1-42E3-F4A5-B6C7D8E9F0A1"); // 2025-06-14
            var day8Id = Guid.Parse("F7A8B9C0-D1E2-43F4-A5B6-C7D8E9F0A1B2"); // 2025-06-15

            return new List<MentorTimeAvailable>
            {
                // Existing time slots (kept unchanged)
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
                    Start = new TimeOnly(11, 0),
                    End = new TimeOnly(12, 0),
                    DayId = Guid.Parse("E1A3F4B8-7C69-45A7-B0F5-92BFFE86754B"),
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000008"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(14, 30),
                    DayId = Guid.Parse("E1A3F4B8-7C69-45A7-B0F5-92BFFE86754B"),
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000009"),
                    Start = new TimeOnly(14, 30),
                    End = new TimeOnly(15, 0),
                    DayId = Guid.Parse("E1A3F4B8-7C69-45A7-B0F5-92BFFE86754B"),
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000010"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(15, 0),
                    DayId = Guid.Parse("A2B1C3D4-E5F6-47A8-9B0C-1D2E3F4A5B6C"),
                    StatusId = bookedStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000011"),
                    Start = new TimeOnly(15, 0),
                    End = new TimeOnly(15, 30),
                    DayId = Guid.Parse("A2B1C3D4-E5F6-47A8-9B0C-1D2E3F4A5B6C"),
                    StatusId = bookedStatus,
                },
                // New slots for day4 (2025-06-11)
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("20000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(9, 0),
                    End = new TimeOnly(9, 30),
                    DayId = day4Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("20000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(9, 30),
                    End = new TimeOnly(10, 0),
                    DayId = day4Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("20000000-0000-0000-0000-000000000003"),
                    Start = new TimeOnly(10, 30),
                    End = new TimeOnly(11, 0),
                    DayId = day4Id,
                    StatusId = availableStatus,
                },
                // New slots for day5 (2025-06-12)
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("21000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(14, 30),
                    DayId = day5Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("21000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(15, 0),
                    End = new TimeOnly(15, 30),
                    DayId = day5Id,
                    StatusId = availableStatus,
                },
                // New slots for day6 (2025-06-13)
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("22000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(13, 0),
                    End = new TimeOnly(13, 30),
                    DayId = day6Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("22000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(14, 30),
                    DayId = day6Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("22000000-0000-0000-0000-000000000003"),
                    Start = new TimeOnly(15, 0),
                    End = new TimeOnly(15, 30),
                    DayId = day6Id,
                    StatusId = availableStatus,
                },
                // New slots for day7 (2025-06-14)
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("23000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(8, 0),
                    End = new TimeOnly(8, 30),
                    DayId = day7Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("23000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(9, 0),
                    End = new TimeOnly(9, 30),
                    DayId = day7Id,
                    StatusId = availableStatus,
                },
                // New slots for day8 (2025-06-15)
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("24000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(10, 0),
                    End = new TimeOnly(10, 30),
                    DayId = day8Id,
                    StatusId = availableStatus,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("24000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(11, 0),
                    End = new TimeOnly(11, 30),
                    DayId = day8Id,
                    StatusId = availableStatus,
                },
            };
        }
    }
}
