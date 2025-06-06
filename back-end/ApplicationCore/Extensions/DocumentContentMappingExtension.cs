using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class DocumentContentMappingExtension
    {
        public static DocumentDetailResponse ToDocumentDetailResponse(this DocumentContent documentContent)
        {
            return new DocumentDetailResponse
            {
                Id = documentContent.Id,
                FileName = documentContent.FileName,
                FileType = documentContent.FileType,
                FileContent = documentContent.FileContent
            };
        }
    }
}