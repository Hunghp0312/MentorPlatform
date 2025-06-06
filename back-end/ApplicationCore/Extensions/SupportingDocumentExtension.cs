﻿using ApplicationCore.DTOs.Responses.SupportingDocuments;
using Infrastructure.Entities;

namespace ApplicationCore.Extensions
{
    public static class SupportingDocumentExtension
    {
        public static SupportingDocumentResponse ToSupportingDocumentResponse(this SupportingDocument supportingDocument)
        {
            return new SupportingDocumentResponse()
            {
                FileId = supportingDocument.DocumentContentId,
                FileName = supportingDocument.FileName,
                FileType = supportingDocument.FileType,
            };
        }
    }
}
