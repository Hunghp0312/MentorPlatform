using ApplicationCore.Common;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace Presentation.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected ActionResult ToActionResult<TResponse>(OperationResult<TResponse> operationResult)
            where TResponse : class
        {
            var responseBody = new { operationResult.Data, operationResult.Message };

            return operationResult.StatusCode switch
            {
                HttpStatusCode.OK => Ok(responseBody),
                HttpStatusCode.Created => Created(string.Empty, responseBody),
                HttpStatusCode.Accepted => Accepted(responseBody),
                HttpStatusCode.NoContent => NoContent(),

                HttpStatusCode.BadRequest => BadRequest(new { operationResult.Message }),
                HttpStatusCode.NotFound => NotFound(new { operationResult.Message }),
                HttpStatusCode.InternalServerError => StatusCode(
                    500,
                    new { operationResult.Message }
                ),

                _ => StatusCode((int)operationResult.StatusCode, new { operationResult.Message }),
            };
        }
    }
}
