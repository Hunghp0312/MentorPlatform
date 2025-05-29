using Infrastructure.Entities;

namespace Infrastructure.Data.Seeding
{
    public static class UserProfileSeeding
    {
        public static List<UserProfile> SeedUserProfiles()
        {
            return new List<UserProfile>
            {
                new UserProfile
                {
                    Id = Guid.Parse("148b5a81-90d6-476d-9fee-747b834011ee"),
                    FullName = "Huy Nguyen Admin",
                    Bio = "Experienced tech administrator with background in education platforms.",
                    ProfessionalSkill = "System administration, DevOps, Cloud infrastructure",
                    IndustryExperience = "Experienced in education platforms, with expertise in system administration, DevOps, and cloud infrastructure.",
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 4,
                    SessionDurationId = 3
                },
                new UserProfile
                {
                    Id = Guid.Parse("237e3ce5-ccde-4d3b-aaa7-02866073d526"),
                    FullName = "Huy Khuong Admin",
                    Bio = "Platform administrator with focus on user experience and system reliability.",
                    ProfessionalSkill = "User management, Technical support, Data analytics",
                    IndustryExperience = "Experienced in user experience and system reliability, with expertise in user management, technical support, and data analytics.",
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 4,
                    SessionDurationId = 3
                },
                new UserProfile
                {
                    Id = Guid.Parse("00a063ca-1414-4425-bf4e-6d48abf2474a"),
                    FullName = "Minh Chau Admin",
                    Bio = "Senior administrator overseeing platform development and technical operations.",
                    ProfessionalSkill = "Project management, System architecture, Team leadership",
                    IndustryExperience = "Experienced in project management, system architecture, and team leadership, with expertise in platform development and technical operations.",
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 4,
                    SessionDurationId = 3
                },
                new UserProfile
                {
                    Id = Guid.Parse("dac43f2d-8e9b-45ee-b539-e6bc25901812"),
                    FullName = "Huy Nguyen Learner",
                    Bio = "Aspiring software developer interested in web technologies and cloud computing.",
                    UserGoal = "To master modern web development frameworks and secure a developer position.",
                    ProfessionalSkill = "Web development, Cloud computing, Problem-solving",
                    IndustryExperience = "Aspiring software developer interested in web technologies and cloud computing, with expertise in web development, cloud computing, and problem-solving.",
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 1,
                    SessionDurationId = 2
                },
                new UserProfile
                {
                    Id = Guid.Parse("f052ecf6-7646-4fa6-8deb-3e991a1e4e16"),
                    FullName = "Huy Khuong Learner",
                    Bio = "Data science enthusiast with background in statistics and mathematics.",
                    UserGoal = "To develop expertise in machine learning algorithms and data visualization.",
                    ProfessionalSkill = "Statistics, Mathematics, Machine learning",
                    IndustryExperience = "Data science enthusiast with background in statistics and mathematics, with expertise in machine learning algorithms and data visualization.",
                    PrivacyProfile = false,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 2,
                    SessionDurationId = 3
                },
                new UserProfile
                {
                    Id = Guid.Parse("f75ff929-94dd-4d03-b1dd-c0f75e70df10"),
                    FullName = "Minh Chau Learner",
                    Bio = "UX/UI designer looking to expand skills in frontend development.",
                    UserGoal = "To combine design expertise with technical implementation skills.",
                    ProfessionalSkill = "UX/UI design, Frontend development, Problem-solving",
                    IndustryExperience = "UX/UI designer looking to expand skills in frontend development, with expertise in UX/UI design, frontend development, and problem-solving.",
                    PrivacyProfile = true,
                    MessagePermission = false,
                    NotificationsEnabled = false,
                    SessionFrequencyId = 3,
                    SessionDurationId = 1
                },
                new UserProfile
                {
                    Id = Guid.Parse("0dd85da0-9214-419e-aa02-adefac68c264"),

                    FullName = "Dan Cega",
                    Bio = "Full-stack developer with interest in blockchain and distributed systems.",
                    UserGoal = "To build scalable decentralized applications and smart contracts.",
                    ProfessionalSkill = "Blockchain, Distributed systems, Problem-solving",
                    IndustryExperience = "Full-stack developer with interest in blockchain and distributed systems, with expertise in blockchain, distributed systems, and problem-solving.",
                    PrivacyProfile = false,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 1,
                    SessionDurationId = 5
                },

                new UserProfile
                {
                    Id = Guid.Parse("03ea823d-d625-448d-901d-411c5028b769"),
                    FullName = "Huy Nguyen Mentor",
                    Bio = "Senior software engineer with 8+ years of experience in full-stack development.",
                    ProfessionalSkill = "Java, Spring, React, AWS, DevOps",
                    IndustryExperience = "Fintech, E-commerce, Enterprise applications",
                    UserGoal = "To teach a seasoned software engineer and lead younge developers.",
                    PrivacyProfile = false,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 2,
                    SessionDurationId = 4
                },
                new UserProfile
                {
                    Id = Guid.Parse("b1c97b14-fc84-4db5-899d-ae4a38996b56"),
                    FullName = "Huy Khuong Mentor",
                    Bio = "Data scientist specializing in predictive analytics and natural language processing.",
                    ProfessionalSkill = "Python, TensorFlow, PyTorch, NLP, Big Data",
                    IndustryExperience = "Healthcare, Research, Marketing analytics",
                    UserGoal = "To share knowledge and expertise in data science and machine learning.",
                    PrivacyProfile = true,
                    MessagePermission = true,
                    NotificationsEnabled = true,
                    SessionFrequencyId = 1,
                    SessionDurationId = 3
                },
                new UserProfile
                {
                    Id = Guid.Parse("862b702e-2c59-46f7-8c06-5349d769e237"),
                    FullName = "Minh Chau Mentor",
                    Bio = "Frontend specialist with expertise in modern JavaScript frameworks and UI/UX principles.",
                    ProfessionalSkill = "React, Vue.js, Angular, SCSS, Accessibility",
                    IndustryExperience = "SaaS products, E-learning platforms, Creative agencies",
                    UserGoal = "To share knowledge and expertise in frontend development and UI/UX design.",
                    PrivacyProfile = false,
                    MessagePermission = true,
                    NotificationsEnabled = false,
                    SessionFrequencyId = 4,
                    SessionDurationId = 2
                }
            };
        }
    }
}