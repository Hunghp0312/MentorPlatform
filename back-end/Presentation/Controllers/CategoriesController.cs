using ApplicationCore.DTOs.Category;
using ApplicationCore.DTOs.Common;
using ApplicationCore.DTOs.QueryParameters;
using ApplicationCore.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : BaseController
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService =
                categoryService ?? throw new ArgumentNullException(nameof(categoryService));
        }

        // POST: api/Categories
        [HttpPost]
        [ProducesResponseType(
            typeof(SuccessResponse<CategoryResponse>),
            StatusCodes.Status201Created
        )]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCategory(
            [FromBody] CreateCategoryRequest createDto
        )
        {
            var result = await _categoryService.CreateCategoryAsync(createDto);

            return ToActionResult(result);
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(
            typeof(SuccessResponse<CategoryResponse>),
            StatusCodes.Status200OK
        )]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            var result = await _categoryService.GetCategoryByIdAsync(id);

            return ToActionResult(result);
        }

        // PUT: api/Categories/{id}
        [HttpPut("{id:guid}")]
        [ProducesResponseType(typeof(SuccessResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCategory(
            Guid id,
            [FromBody] UpdateCategoryRequest updateDto
        )
        {
            var result = await _categoryService.UpdateCategoryAsync(id, updateDto);

            return ToActionResult(result);
        }

        [HttpGet("all")]
        [ProducesResponseType(
            typeof(SuccessResponse<ICollection<CategoryResponse>>),
            StatusCodes.Status200OK
        )]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();

            return ToActionResult(categories);
        }

        [HttpGet]
        [ProducesResponseType(
            typeof(SuccessResponse<PagedResult<CategoryResponse>>),
            StatusCodes.Status200OK
        )]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPagedCategories(
            [FromQuery] CategoryQueryParameters parameters
        )
        {
            var result = await _categoryService.GetPagedCategoriesAsync(parameters);

            return ToActionResult(result);
        }

        [HttpDelete("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status404NotFound)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status409Conflict)]
        [ProducesResponseType(typeof(FailResponse), StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCategory(Guid id)
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            return ToActionResult(result);
        }
    }
}
