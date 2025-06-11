namespace ApplicationCore.DTOs.Responses.Resources;

public class CourseResourceResponse
{
    public Guid ResourceId { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string TypeOfResource { get; set; }

}
