using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class SessionBookingSeeding
    {
        public static List<SessionBooking> SeedSessionBookings()
        {
            var mentor1Id = Guid.Parse("03EA823D-D625-448D-901D-411C5028B769");
            var learner1Id = Guid.Parse("F052ECF6-7646-4FA6-8DEB-3E991A1E4E16");

            var slotFromMentor1 = Guid.Parse("10000000-0000-0000-0000-000000000001");
            var slot2FromMentor1 = Guid.Parse("10000000-0000-0000-0000-000000000002");
            int pendingStatusId = 1;
            int onlineVideoTypeId = 3;

            return new List<SessionBooking>
            {
                new SessionBooking
                {
                    Id = Guid.Parse("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"),
                    LearnerId = learner1Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = slotFromMentor1,
                    StatusId = pendingStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "I would like to discuss about C# performance optimization.",
                    CreatedAt = new DateTime(2025, 5, 28, 10, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("305d81fd-ad60-4a28-8262-dea62b7aa589"),
                    LearnerId = learner1Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = slot2FromMentor1,
                    StatusId = pendingStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Please help me review my CV for a junior developer position.",
                    CreatedAt = new DateTime(2025, 5, 29, 11, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("e7b9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1a"),
                    LearnerId = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                    MentorId = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"),
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                    StatusId = 6,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Please",
                    CreatedAt = new DateTime(2025, 5, 29, 11, 0, 0, DateTimeKind.Utc),
                },
            };
        }
    }
}
