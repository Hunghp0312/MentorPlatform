using System.Net;

namespace ApplicationCore.Common
{
    public class OperationResult<T>
        where T : class
    {
        public bool Success { get; private set; }
        public string? Message { get; private set; }
        public T? Data { get; private set; }
        public HttpStatusCode StatusCode { get; private set; }

        private OperationResult(bool success, T? data, string? message, HttpStatusCode statusCode)
        {
            Success = success;
            Data = data;
            Message = message;
            StatusCode = statusCode;
        }

        public static OperationResult<T> Ok(string? message = null) =>
            new OperationResult<T>(true, default, message, HttpStatusCode.OK);

        public static OperationResult<T> Ok(T data, string? message = null) =>
            new OperationResult<T>(true, data, message, HttpStatusCode.OK);

        public static OperationResult<T> Created(T data, string? message = null) =>
            new OperationResult<T>(true, data, message, HttpStatusCode.Created);

        public static OperationResult<T> Accepted(T data, string? message = null) =>
            new OperationResult<T>(true, data, message, HttpStatusCode.Accepted);

        public static OperationResult<T> NoContent() =>
            new OperationResult<T>(true, null, null, HttpStatusCode.NoContent);

        // --- Failure Results ---
        public static OperationResult<T> Fail(string message, HttpStatusCode statusCode = HttpStatusCode.InternalServerError) =>
          new OperationResult<T>(false, default, message, statusCode);
        public static OperationResult<T> Conflict(string message) =>
            new OperationResult<T>(false, default, message, HttpStatusCode.Conflict);

        public static OperationResult<T> Unauthorized(string message) =>
            new OperationResult<T>(false, default, message, HttpStatusCode.Unauthorized);

        public static OperationResult<T> BadRequest(string message) =>
    new OperationResult<T>(false, null, message, HttpStatusCode.BadRequest);

        public static OperationResult<T> NotFound(string message) =>
            new OperationResult<T>(false, null, message, HttpStatusCode.NotFound);
    }
}
