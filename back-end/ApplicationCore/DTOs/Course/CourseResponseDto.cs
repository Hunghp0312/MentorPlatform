using namespace ApplicationCore.Entity;

namespace ApplicationCore.DTOs.Course
{
    public class CourseResponseDto
    {
        public Guid Id
        {
            get, set};

        public string Title
        {
            get, set};

        public string Description
        {
            get, set};

        public Category Category
        {
            get, set};
        public CourseStatus Status
        {
            get, set};
        }
    }
