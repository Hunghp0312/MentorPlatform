using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ApplicationCore.DTOs
{
    public class CreateCourseRequest
    {
        [Required]
        [MaxLength(100)]
        public string Title { get; set; }

        [Required]
        public Guid CategoryId { get; set; }

        [Required]
        public int Status { get; set; }

        [Required]
        public int Difficulty { get; set; }

        [Required]
        [MaxLength(100)]
        public string Duration { get; set; }

        public List<string> Tags { get; set; }

        [Required]
        [MaxLength(100)]
        public string Description { get; set; }
    }

    public class CourseResponse
    {
        public Guid Id { get; set; }
        public Guid CategoryId { get; set; }
        public int Status { get; set; }
        public int Difficulty { get; set; }
        public string Title { get; set; }
        public string Duration { get; set; }
        public DateTime Created { get; set; }
        public DateTime LastUpdated { get; set; }
        public List<string> Tags { get; set; }
        public string Description { get; set; }
    }
}