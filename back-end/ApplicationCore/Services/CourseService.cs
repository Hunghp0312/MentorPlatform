using ApplicationCore.Common;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.DTOs.Requests.Courses;
using ApplicationCore.DTOs.Responses.Courses;
using ApplicationCore.Extensions;
using ApplicationCore.Repositories.RepositoryInterfaces;
using ApplicationCore.Services.ServiceInterfaces;
using Infrastructure.Data;
using Infrastructure.Entities;
using Microsoft.EntityFrameworkCore;

namespace ApplicationCore.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepo;
        private readonly ICategoryRepository _categoryRepo;
        private readonly IUnitOfWork _unitOfWork;

        public CourseService(
            IUnitOfWork unitOfWork,
            ICourseRepository courseRepo,
            ICategoryRepository categoryRepo
        )
        {
            _courseRepo = courseRepo;
            _categoryRepo = categoryRepo;
            _unitOfWork = unitOfWork;
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> CreateCourseAsync(
            CreateUpdateCourseRequest request,
            Guid userId,
            string role
        )
        {

            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound("Category not found");
            }

            var course = request.ToCourseEntity();
            if (role == "Mentor")
            {
                course.MentorId = userId;
            }
            await _courseRepo.AddAsync(course);
            await _unitOfWork.SaveChangesAsync();

            course = await _courseRepo.GetCourseWithCategoryAsync(course.Id);

            var response = course!.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Created(
                response,
                "Course created successfully"
            );
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> GetCourseDetailsByIdAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetCourseWithCategoryAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            var response = course.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Ok(response);
        }

        public async Task<
            OperationResult<ICollection<GetCourseDetailsResponse>>
        > GetCourseByMentorIdAsync(Guid mentorId)
        {
            var courses = await _courseRepo.GetCoursesByMentorId(mentorId);

            if (courses == null)
            {
                return OperationResult<ICollection<GetCourseDetailsResponse>>.NotFound(
                    "Courses not found"
                );
            }

            var response = courses.Select(CourseMappingExtension.CourseDetailResponseMap).ToList();
            return OperationResult<ICollection<GetCourseDetailsResponse>>.Ok(response);
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> UpdateCourseAsync(
            Guid courseId,
            CreateUpdateCourseRequest request
        )
        {
            var category = await _categoryRepo.GetByIdAsync(request.CategoryId);

            if (category == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound("Category not found");
            }

            var course = await _courseRepo.GetCourseWithCategoryAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            course.Name = request.Name;
            course.Description = request.Description;
            course.CategoryId = request.CategoryId;
            course.StatusId = request.StatusId;
            course.LevelId = request.LevelId;
            course.Duration = request.Duration;
            course.LastUpdated = DateTime.UtcNow;
            course.Tags = TagHelper.ConvertListToString(request.Tags);

            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();

            course = await _courseRepo.GetCourseWithCategoryAsync(courseId);

            var response = course!.CourseDetailResponseMap();

            return OperationResult<GetCourseDetailsResponse>.Ok(response);
        }

        public async Task<OperationResult<GetCourseDetailsResponse>> DeleteCourseAsync(
            Guid courseId
        )
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
            {
                return OperationResult<GetCourseDetailsResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }

            _courseRepo.Delete(course);
            await _unitOfWork.SaveChangesAsync();

            return OperationResult<GetCourseDetailsResponse>.NoContent();
        }

        public async Task<
            OperationResult<PagedResult<GetCourseDetailsResponse>>
        > GetPagedCourseAsync(CourseQueryParameters req)
        {
            if (req.PageIndex < 1)
                req.PageIndex = 1;

            if (req.PageSize < 1 || req.PageSize > 20)
                req.PageSize = 10;

            Func<IQueryable<Course>, IQueryable<Course>> filter = query =>
            {
                if (!string.IsNullOrWhiteSpace(req.Query))
                {
                    query = query.Where(c =>
                        c.Name.Contains(req.Query) || c.Description.Contains(req.Query)
                    );
                }

                if (req.MentorId.HasValue)
                {
                    query = query.Where(c => c.MentorId == req.MentorId);
                }

                if (req.Level.HasValue)
                {
                    query = query.Where(c => c.LevelId == req.Level);
                }

                if (req.CategoryId.HasValue && req.CategoryId.Value != Guid.Empty)
                {
                    query = query.Where(c => c.CategoryId == req.CategoryId.Value);
                }

                return query;
            };

            var (courses, totalCourses) = await _courseRepo.GetPagedCoursesAsync(
                filter,
                req.PageIndex,
                req.PageSize
            );

            var CourseDetailsResponse = courses
                .Select(CourseMappingExtension.CourseDetailResponseMap)
                .ToList();

            var coursesPageResponse = new PagedResult<GetCourseDetailsResponse>
            {
                Items = CourseDetailsResponse,
                PageIndex = req.PageIndex,
                PageSize = req.PageSize,
                TotalItems = totalCourses,
            };

            return OperationResult<PagedResult<GetCourseDetailsResponse>>.Ok(coursesPageResponse);
        }

        public async Task<OperationResult<MessageResponse>> EnrollCourse(Guid courseId, Guid userId)
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
            {
                return OperationResult<MessageResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }
            course.LearnerCourses.Add(new LearnerCourse
            {
                CourseId = courseId,
                LearnerId = userId,
            });
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<MessageResponse>.Ok(
                new MessageResponse { Message = "Enrolled successfully" }
            );
        }

        public async Task<OperationResult<MessageResponse>> FinishCourse(Guid courseId, Guid userId)
        {
            var course = await _courseRepo.GetCourseWithLearnerCourseAsync(courseId);
            if (course == null)
            {
                return OperationResult<MessageResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }
            course.LearnerCourses.Where(lc => lc.LearnerId == userId).ToList().ForEach(lc =>
            {
                lc.IsCompleted = true;
            });
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<MessageResponse>.Ok(
                new MessageResponse { Message = "Course marked as completed" }
            );
        }
        public async Task<OperationResult<MessageResponse>> AssignCourse(Guid courseId, Guid mentorId)
        {
            var course = await _courseRepo.GetByIdAsync(courseId);
            if (course == null)
            {
                return OperationResult<MessageResponse>.NotFound(
                    $"Course with ID {courseId} not found"
                );
            }
            if (mentorId == Guid.Empty)
            {
                return OperationResult<MessageResponse>.BadRequest("Mentor ID cannot be empty");
            }
            if (mentorId == course.MentorId)
            {
                return OperationResult<MessageResponse>.BadRequest("Course is already assigned to this mentor");
            }

            if (course.MentorId != Guid.Empty)
            {
                return OperationResult<MessageResponse>.BadRequest(
                    "Course is already assigned to a mentor"
                );
            }
            course.MentorId = mentorId;
            _courseRepo.Update(course);
            await _unitOfWork.SaveChangesAsync();
            return OperationResult<MessageResponse>.Ok(
                new MessageResponse { Message = "Course assigned successfully" }
            );
        }

        public async Task<OperationResult<CourseDashboardDto>> GetCourseDashBoardAsync(Guid mentorId, PaginationParameters paginationParameters)
        {
            paginationParameters.PageSize = 2;
            CourseDashboardKpiDto courseDashboardKpiDto = new CourseDashboardKpiDto();
            courseDashboardKpiDto.TotalCourses = await _courseRepo
                                                        .GetAllQueryable().Where(c => c.MentorId == mentorId).CountAsync();

            var coursesByMentor = (await _courseRepo
                                                         .GetAllQueryable()
                                                         .Include(c => c.LearnerCourses)
                                                         .Where(c => c.MentorId == mentorId)
                                                         .ToListAsync());

            foreach (var course in coursesByMentor)
            {
                courseDashboardKpiDto.ActiveStudents += course.LearnerCourses.Count;
            }

            courseDashboardKpiDto.PublishedCourses = await _courseRepo
                                                        .GetAllQueryable()
                                                        .Where(c => c.MentorId == mentorId && c.StatusId == 2)
                                                        .CountAsync();

            Func<IQueryable<Course>, IQueryable<Course>> filter = query =>
            {
                query = query.Where(sb => sb.MentorId == mentorId);
                query = query.OrderByDescending(sb => sb.Created);

                return query;
            };

            var (courses, totalItems) = await _courseRepo.GetPagedAsync(
                filter,
                paginationParameters.PageIndex,
                paginationParameters.PageSize
            );

            var courseDtos = courses.Select(sb => new CourseDashboardResponse
            {
                Name = sb.Name,
                CourseStatus = sb.Status!.Name,
                CourseLevel = sb.Level!.Name,
                Created = sb.Created,
                CategoryName = sb.Category!.Name,
                NumberOfStudent = sb.LearnerCourses.Count,
                CompletePercent = sb.LearnerCourses.Any() ?
             (int)Math.Round(((double)sb.LearnerCourses.Count(lc => lc.IsCompleted) / sb.LearnerCourses.Count) * 100)
            : 0,
            }).ToList();

            CourseDashboardDto mentorDashboardDto = new CourseDashboardDto() { CourseKPIs = courseDashboardKpiDto, Courses = courseDtos };

            return OperationResult<CourseDashboardDto>.Ok(mentorDashboardDto);
        }
    }
}
