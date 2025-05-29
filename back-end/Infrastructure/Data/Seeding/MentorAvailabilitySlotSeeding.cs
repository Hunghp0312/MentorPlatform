using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class MentorAvailabilitySlotSeeding
    {
        public static List<MentorAvailabilitySlot> SeedMentorAvailabilitySlots()
        {
            var mentor1Id = Guid.Parse("03EA823D-D625-448D-901D-411C5028B769");
            var mentor2Id = Guid.Parse("862B702E-2C59-46F7-8C06-5349D769E237");
            var slot1Id = Guid.Parse("DA331A4B-3665-4D78-99A6-825DA4015E76");
            var slot2Id = Guid.Parse("4A6E7525-23E4-4D6F-930B-22F2E40783D9");
            var slot3Id = Guid.Parse("F4E2B81E-479A-4B6A-8A4D-08D3E4C8A6B0");
            var slot4Id = Guid.Parse("1C7B9F0E-9C3A-4B8F-8E6A-1B9E7B1A3B0F");
            var slot5Id = Guid.Parse("9E8D7C6B-5A4B-3C2D-1E0F-A9B8C7D6E5F4");
            int availableStatusId = 1;

            return new List<MentorAvailabilitySlot>
            {
                new MentorAvailabilitySlot
                {
                    Id = slot1Id,
                    MentorId = mentor1Id,
                    StartTime = new DateTime(2025, 6, 2, 9, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2025, 6, 2, 10, 0, 0, DateTimeKind.Utc),
                    StatusId = availableStatusId
                },
                new MentorAvailabilitySlot
                {
                    Id = slot2Id,
                    MentorId = mentor1Id,
                    StartTime = new DateTime(2025, 6, 2, 10, 0, 0, DateTimeKind.Utc),
                    EndTime = new DateTime(2025, 6, 2, 11, 0, 0, DateTimeKind.Utc),
                    StatusId = availableStatusId
                },
                new MentorAvailabilitySlot
                {
                    Id = slot3Id,
                    MentorId = mentor1Id,
                    StartTime = new DateTime(2025, 6, 3, 14, 0, 0, DateTimeKind.Utc), // 2:00 PM
                    EndTime = new DateTime(2025, 6, 3, 15, 0, 0, DateTimeKind.Utc),   // 3:00 PM
                    StatusId = availableStatusId
                },
                new MentorAvailabilitySlot
                {
                    Id = slot4Id,
                    MentorId = mentor2Id,
                    StartTime = new DateTime(2025, 6, 5, 19, 0, 0, DateTimeKind.Utc), // 7:00 PM
                    EndTime = new DateTime(2025, 6, 5, 20, 0, 0, DateTimeKind.Utc),   // 8:00 PM
                    StatusId = availableStatusId
                },
                new MentorAvailabilitySlot
                {
                    Id = slot5Id,
                    MentorId = mentor2Id,
                    StartTime = new DateTime(2025, 6, 7, 10, 0, 0, DateTimeKind.Utc), // 10:00 
                    EndTime = new DateTime(2025, 6, 7, 11, 0, 0, DateTimeKind.Utc),   // 11:00 AM
                    StatusId = availableStatusId
                }
            };
        }
    }
}
