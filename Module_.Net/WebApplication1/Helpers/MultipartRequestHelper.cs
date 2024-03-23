using Azure.Core;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.Net.Http.Headers;
using System.Net.Mime;

namespace WebApplication1.Helpers
{
    public static class MultipartRequestHelper
    {
        public static MultipartReader GetMultipartReader(string? contentType, Stream requestBody)
        {
            if (contentType != null && !IsMultipartContentType(contentType))
            {
                throw new InvalidDataException("FormData is missing multipart content type");
            }

            var boundary = GetBoundary(
                MediaTypeHeaderValue.Parse(contentType),
                new FormOptions().MultipartBoundaryLengthLimit);

            return new MultipartReader(boundary, requestBody);
        }

        public static bool IsMultipartContentType(string contentType)
        {
            return !string.IsNullOrEmpty(contentType)
                   && contentType.IndexOf("multipart/", StringComparison.OrdinalIgnoreCase) >= 0;
        }

        public static string GetBoundary(MediaTypeHeaderValue contentType, int lengthLimit)
        {
            var boundary = HeaderUtilities.RemoveQuotes(contentType.Boundary).Value;

            if (string.IsNullOrWhiteSpace(boundary))
            {
                throw new InvalidDataException("Missing content-type boundary.");
            }

            if (boundary.Length > lengthLimit)
            {
                throw new InvalidDataException(
                    $"Multipart boundary length limit {lengthLimit} exceeded.");
            }

            return boundary;
        }

        public static bool HasFileContentDisposition(ContentDispositionHeaderValue? contentDisposition)
        {
            return contentDisposition != null
                   && contentDisposition.DispositionType.Equals("form-data")
                   && (!string.IsNullOrEmpty(contentDisposition.FileName.Value)
                       || !string.IsNullOrEmpty(contentDisposition.FileNameStar.Value));
        }
    }
}
