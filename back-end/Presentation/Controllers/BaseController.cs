using System.Net;
using ApplicationCore.Common;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [ApiController]
    public class BaseController : ControllerBase
    {
        protected ActionResult ToActionResult<TResponse>(OperationResult<TResponse> operationResult)
            where TResponse : class
        {
            return operationResult.StatusCode switch
            {
                HttpStatusCode.OK => Ok(operationResult.Data),
                HttpStatusCode.Created => Created(string.Empty, operationResult.Data),
                HttpStatusCode.Accepted => Accepted(operationResult.Data),
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
