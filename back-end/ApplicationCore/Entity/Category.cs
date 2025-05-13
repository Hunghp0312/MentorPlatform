using System.ComponentModel.DataAnnotations;

namespace ApplicationCore.Entity
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; }
        [Required]
        [StringLength(100)]
        public string Name { get; set; }
        [Required]
        [StringLength(1000)]
        public string Description { get; set; }
        [Required]
        public bool Status { get; set; }
        public ICollection<Course> Courses { get; set; } = new List<Course>();


        //not apear in database
        public int CourseCount => Courses?.Count ?? 0;
    }
}