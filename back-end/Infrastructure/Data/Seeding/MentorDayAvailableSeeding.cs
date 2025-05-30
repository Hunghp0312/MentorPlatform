using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class MentorDayAvailableSeeding
    {
        public static List<MentorDayAvailable> SeedMentorDayAvailable()
        {
            var mentor1Id = Guid.Parse("03EA823D-D625-448D-901D-411C5028B769");
            var mentor2Id = Guid.Parse("862B702E-2C59-46F7-8C06-5349D769E237");

            return new List<MentorDayAvailable>
            {
                new MentorDayAvailable
                {
                    Id = Guid.Parse("DA331A4B-3665-4D78-99A6-825DA4015E76"),
                    MentorId = mentor1Id,
                    Day = new DateOnly(2025, 6, 2),
                    StartWorkTime = new TimeOnly(9, 0),
                    EndWorkTime = new TimeOnly(12, 0),
                    SessionDuration = new TimeOnly(1, 0),
                    BufferTime = new TimeOnly(0, 15),
                },
                new MentorDayAvailable
                {
                    Id = Guid.Parse("4A6E7525-23E4-4D6F-930B-22F2E40783D9"),
                    MentorId = mentor1Id,
                    Day = new DateOnly(2025, 6, 3),
                    StartWorkTime = new TimeOnly(14, 0),
                    EndWorkTime = new TimeOnly(17, 0),
                    SessionDuration = new TimeOnly(1, 0),
                    BufferTime = new TimeOnly(0, 15),
                },
                new MentorDayAvailable
                {
                    Id = Guid.Parse("F4E2B81E-479A-4B6A-8A4D-08D3E4C8A6B0"),
                    MentorId = mentor2Id,
                    Day = new DateOnly(2025, 6, 5),
                    StartWorkTime = new TimeOnly(19, 0),
                    EndWorkTime = new TimeOnly(21, 0),
                    SessionDuration = new TimeOnly(1, 0),
                    BufferTime = new TimeOnly(0, 15),
                },
                new MentorDayAvailable
                {
                    Id = Guid.Parse("1C7B9F0E-9C3A-4B8F-8E6A-1B9E7B1A3B0F"),
                    MentorId = mentor2Id,
                    Day = new DateOnly(2025, 6, 7),
                    StartWorkTime = new TimeOnly(10, 0),
                    EndWorkTime = new TimeOnly(12, 30),
                    SessionDuration = new TimeOnly(0, 45), // 45 minutes sessions
                    BufferTime = new TimeOnly(0, 15),
                },
                new MentorDayAvailable
                {
                    Id = Guid.Parse("9E8D7C6B-5A4B-3C2D-1E0F-A9B8C7D6E5F4"),
                    MentorId = mentor2Id,
                    Day = new DateOnly(2025, 6, 8),
                    StartWorkTime = new TimeOnly(8, 30),
                    EndWorkTime = new TimeOnly(11, 0),
                    SessionDuration = new TimeOnly(0, 30), // 30 minutes sessions
                    BufferTime = new TimeOnly(0, 10),
                },
                new MentorDayAvailable
                {
                    Id = Guid.Parse("E1A3F4B8-7C69-45A7-B0F5-92BFFE86754B"),
                    MentorId = mentor1Id,
                    Day = new DateOnly(2025, 6, 9),
                    StartWorkTime = new TimeOnly(13, 0),
                    EndWorkTime = new TimeOnly(15, 30),
                    SessionDuration = new TimeOnly(0, 30),
                    BufferTime = new TimeOnly(0, 5),
                },
            };
        }
    }
}
