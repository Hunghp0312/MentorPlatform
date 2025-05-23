using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Infrastructure.Entities
{
    public class MentorTeachingApproach
    {
        public Guid UserId { get; set; }
        public UserProfile? UserProfile { get; set; }
        public int TeachingApproachId { get; set; }


    }
}