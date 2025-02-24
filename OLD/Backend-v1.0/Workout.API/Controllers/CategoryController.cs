using Microsoft.AspNetCore.Mvc;
using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;

namespace Workout.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        private int GetUserId()
        {
            var user = HttpContext.Items["User"] as dynamic;
            if (user == null)
            {
                return -1; 
            }

            if (!int.TryParse(user.Id.ToString(), out int userId))
            {
                return -1; 
            }
            
            return userId; 
        }
        
        private async Task<IActionResult> HandleUnauthorizedAccessException(Func<Task<IActionResult>> action)
        {
            try
            {
                return await action();
            }
            catch (UnauthorizedAccessException)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var categories = await _categoryService.GetAllCategories(userId.ToString());
                return Ok(categories);
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var category = await _categoryService.GetCategoryById(id, userId.ToString());
                if (category == null)
                {
                    return NotFound();
                }
                return Ok(category);
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryRequest categoryRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var category = new Category
                {
                    Name = categoryRequest.Name,
                    Description = categoryRequest.Description,
                    Type = categoryRequest.Type,
                    UserId = userId.ToString()
                };

                await _categoryService.CreateCategory(category);
                return CreatedAtAction(nameof(GetCategoryById), new { id = category.Id }, category);
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryRequest categoryRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var existingCategory = await _categoryService.GetCategoryById(id, userId.ToString());
                if (existingCategory == null)
                {
                    return NotFound();
                }

                existingCategory.Name = categoryRequest.Name;
                existingCategory.Description = categoryRequest.Description;
                existingCategory.Type = categoryRequest.Type;

                await _categoryService.UpdateCategory(existingCategory);
                return NoContent();
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var category = await _categoryService.GetCategoryById(id, userId.ToString());
                if (category == null)
                {
                    return NotFound();
                }

                await _categoryService.DeleteCategory(id, userId.ToString());
                return NoContent();
            });
        }
    }
}