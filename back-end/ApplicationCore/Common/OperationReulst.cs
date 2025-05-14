using ApplicationCore.Entity;

namespace ApplicationCore.Common
{
    public class OperationResult<T>
        where T : class
    {
        public bool Success { get; private set; }
        public string? Message { get; private set; }
        public T? Data { get; private set; }

        private OperationResult(bool success, T? data, string? message)
        {
            Success = success;
            Data = data;
            Message = message;
        }

        public static OperationResult<T> Ok(string? message = null) =>
            new OperationResult<T>(true, default, message);

        public static OperationResult<T> Ok(T data, string? message = null) =>
            new OperationResult<T>(true, data, message);

        public static OperationResult<T> Fail(string message) =>
            new OperationResult<T>(false, default, message);
    }
}
