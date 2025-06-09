using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class SessionBookingSeeding
    {
        public static List<SessionBooking> SeedSessionBookings()
        {
            var mentor1Id = Guid.Parse("03EA823D-D625-448D-901D-411C5028B769");
            var learner1Id = Guid.Parse("F052ECF6-7646-4FA6-8DEB-3E991A1E4E16");
            var learner2Id = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812");

            int pendingStatusId = 1;
            int bookedStatusId = 2;
            int approvedStatusId = 6;

            int onlineVideoTypeId = 3; // Assume 3 is for original data and 1 for new — using 3 for consistency

            return new List<SessionBooking>
            {
                // Learner1 - Pending
                new SessionBooking
                {
                    Id = Guid.Parse("4c4b3461-068e-4a42-8ba0-647fe1ad5a9d"),
                    LearnerId = learner1Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000001"),
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
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000002"),
                    StatusId = pendingStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Please help me review my CV for a junior developer position.",
                    CreatedAt = new DateTime(2025, 5, 29, 11, 0, 0, DateTimeKind.Utc),
                },
                // Learner2 - Approved
                new SessionBooking
                {
                    Id = Guid.Parse("e7b9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1a"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000007"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Please",
                    CreatedAt = new DateTime(2025, 5, 30, 11, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("b1b9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1b"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000008"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "help me",
                    CreatedAt = new DateTime(2025, 5, 30, 11, 5, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("c2c9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1c"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000009"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "to",
                    CreatedAt = new DateTime(2025, 5, 30, 11, 10, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("d3d9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1d"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000010"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "do",
                    CreatedAt = new DateTime(2025, 5, 30, 11, 15, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("e4e9e6c7-2b2e-4e3d-8e2b-1a5f3c9e7b1e"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("10000000-0000-0000-0000-000000000011"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "this",
                    CreatedAt = new DateTime(2025, 5, 30, 11, 20, 0, DateTimeKind.Utc),
                },
                // Learner2 - Booked
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000001"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("20000000-0000-0000-0000-000000000001"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Need help with topic A",
                    CreatedAt = new DateTime(2025, 5, 31, 8, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000002"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("20000000-0000-0000-0000-000000000002"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Review topic B",
                    CreatedAt = new DateTime(2025, 5, 31, 9, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000003"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("20000000-0000-0000-0000-000000000003"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Follow-up discussion",
                    CreatedAt = new DateTime(2025, 5, 31, 10, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000004"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("21000000-0000-0000-0000-000000000001"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Clarify topic C",
                    CreatedAt = new DateTime(2025, 5, 31, 11, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000005"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("21000000-0000-0000-0000-000000000002"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Homework support",
                    CreatedAt = new DateTime(2025, 5, 31, 12, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000006"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("22000000-0000-0000-0000-000000000001"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Go deeper into topic D",
                    CreatedAt = new DateTime(2025, 6, 1, 8, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000007"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("22000000-0000-0000-0000-000000000002"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Need more explanation",
                    CreatedAt = new DateTime(2025, 6, 1, 9, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000008"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("22000000-0000-0000-0000-000000000003"),
                    StatusId = bookedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Test prep",
                    CreatedAt = new DateTime(2025, 6, 1, 10, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000009"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("23000000-0000-0000-0000-000000000001"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "8am sharp session",
                    CreatedAt = new DateTime(2025, 6, 2, 8, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000010"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("23000000-0000-0000-0000-000000000002"),
                    StatusId = bookedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Morning review",
                    CreatedAt = new DateTime(2025, 6, 2, 9, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000011"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("24000000-0000-0000-0000-000000000001"),
                    StatusId = approvedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Weekend help",
                    CreatedAt = new DateTime(2025, 6, 3, 10, 0, 0, DateTimeKind.Utc),
                },
                new SessionBooking
                {
                    Id = Guid.Parse("aaaaaaaa-0000-0000-0000-000000000012"),
                    LearnerId = learner2Id,
                    MentorId = mentor1Id,
                    MentorTimeAvailableId = Guid.Parse("24000000-0000-0000-0000-000000000002"),
                    StatusId = bookedStatusId,
                    SessionTypeId = onlineVideoTypeId,
                    LearnerMessage = "Last-minute help",
                    CreatedAt = new DateTime(2025, 6, 3, 11, 0, 0, DateTimeKind.Utc),
                },
            };
        }
    }
}
