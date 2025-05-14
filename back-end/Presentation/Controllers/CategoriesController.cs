using ApplicationCore.DTOs.Category;
using ApplicationCore.Interfaces.ServiceInterfaces;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models.Dtos.QueryParameter;

namespace Presentation.Controllers // Hoặc namespace phù hợp với project Presentation của bạn
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
        [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Cho lỗi duplicate
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CreateCategory(
            [FromBody] CreateCategoryRequestDto createDto
        )
        {
            if (!ModelState.IsValid) // FluentValidation (nếu có rule khác) vẫn chạy
            {
                return BadRequest(ModelState);
            }

            try
            {
                var createdCategory = await _categoryService.CreateCategoryAsync(createDto);
                return CreatedAtAction(
                    nameof(GetCategoryById),
                    new { id = createdCategory.Id },
                    createdCategory
                );
            }
            catch (ArgumentException ex)
            {
                if (ex.Message.Contains("already exists"))
                {
                    return Conflict(new { message = ex.Message });
                }
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred while creating the category."
                );
            }
        }

        [HttpGet("{id:guid}")]
        [ProducesResponseType(typeof(CategoryResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetCategoryById(Guid id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null)
                {
                    return NotFound(new { message = $"Category with ID: {id} not found." });
                }
                return Ok(category);
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred while retrieving the category."
                );
            }
        }

        // PUT: api/Categories/{id}
        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)] // Cho lỗi duplicate khi update
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> UpdateCategory(
            Guid id,
            [FromBody] UpdateCategoryRequestDto updateDto
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id == Guid.Empty)
            {
                return BadRequest(new { message = "Category ID is not valid." });
            }

            try
            {
                await _categoryService.UpdateCategoryAsync(id, updateDto);

                return NoContent();
            }
            catch (ArgumentException ex)
            {
                if (ex.Message.Contains("already exists") || ex.Message.Contains("already used"))
                {
                    return Conflict(new { message = ex.Message });
                }
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    "An unexpected error occurred while updating the category."
                );
            }
        }

        [HttpGet("all")]
        [ProducesResponseType(typeof(ICollection<CategoryResponseDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetAllCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }

        [HttpGet]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> GetPagedCategories([FromQuery] CategoryQueryParameters parameters)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var requestDto = new CategoryPagedRequestDto
            {
                Query = parameters.Query,
                Status = parameters.Status,
                PageIndex = parameters.Page,
                PageSize = parameters.PageSize,
            };

            var pagedResult = await _categoryService.GetPagedCategoriesAsync(requestDto);
            return Ok(pagedResult);
        }
    }
}
