using ApplicationCore.DTOs.Responses.SupportingDocuments;

namespace ApplicationCore.DTOs.Responses.Mentors
{
    public class MentorApplicationDetailResponse : BaseMentorApplicationResponse
    {
        public List<DocumentDetailResponse> DocumentsDetails { get; set; } = new List<DocumentDetailResponse>();
        public string? RequestInfoDate { get; set; }
        public string? AdminComments { get; set; }
        public string? RejectionReason { get; set; }
        public string? ApproverName { get; set; }
        public DateTime? ApproverDate { get; set; }
    }
}
