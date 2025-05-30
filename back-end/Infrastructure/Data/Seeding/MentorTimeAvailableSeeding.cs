using System;
using System.Collections.Generic;
using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class MentorTimeAvailableSeeding
    {
        public static List<MentorTimeAvailable> SeedMentorTimeAvailable()
        {
            var statusAvailableId = 1;

            // Pre-seeded Day IDs from MentorDayAvailable
            var day1Id = Guid.Parse("DA331A4B-3665-4D78-99A6-825DA4015E76"); // 2025-06-02
            var day2Id = Guid.Parse("4A6E7525-23E4-4D6F-930B-22F2E40783D9"); // 2025-06-03
            var day3Id = Guid.Parse("F4E2B81E-479A-4B6A-8A4D-08D3E4C8A6B0"); // etc.

            return new List<MentorTimeAvailable>
            {
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000001"),
                    Start = new TimeOnly(9, 0),
                    End = new TimeOnly(9, 30),
                    DayId = day1Id,
                    StatusId = statusAvailableId,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    Start = new TimeOnly(9, 30),
                    End = new TimeOnly(10, 0),
                    DayId = day1Id,
                    StatusId = statusAvailableId,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000003"),
                    Start = new TimeOnly(14, 0),
                    End = new TimeOnly(14, 30),
                    DayId = day2Id,
                    StatusId = statusAvailableId,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000004"),
                    Start = new TimeOnly(14, 30),
                    End = new TimeOnly(15, 0),
                    DayId = day2Id,
                    StatusId = statusAvailableId,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000005"),
                    Start = new TimeOnly(10, 0),
                    End = new TimeOnly(10, 30),
                    DayId = day3Id,
                    StatusId = statusAvailableId,
                },
                new MentorTimeAvailable
                {
                    Id = Guid.Parse("10000000-0000-0000-0000-000000000006"),
                    Start = new TimeOnly(10, 30),
                    End = new TimeOnly(11, 0),
                    DayId = day3Id,
                    StatusId = statusAvailableId,
                },
            };
        }
    }
}
