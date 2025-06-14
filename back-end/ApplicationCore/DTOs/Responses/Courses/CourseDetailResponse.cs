﻿using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.Requests.Categories;
using ApplicationCore.DTOs.Responses.Resources;
using ApplicationCore.DTOs.Responses.Users;
using Infrastructure.Entities.Enum;

namespace ApplicationCore.DTOs.Responses.Courses;

public class CourseDetailResponse : BaseResponse
{
    public required CourseCategoryResponse Category { get; set; }
    public required CourseStatus Status { get; set; }
    public required CourseLevel Level { get; set; }
    public required string Duration { get; set; }
    public DateTime Created { get; set; }
    public required List<string> Tags { get; set; }
    public DateTime LastUpdated { get; set; }
    public int StudentCount { get; set; }
    public double Completion { get; set; }
    public List<ResourceResponeGetAllService> Resources { get; set; } = [];
    public bool IsEnroll { get; set; }
    public bool IsCompleted { get; set; }
    public UserResponseDto? Mentor { get; set; }
}
