using Microsoft.AspNetCore.Mvc;
using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;

namespace Workout.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExerciseController : ControllerBase
    {
        private readonly IExerciseService _exerciseService;

        public ExerciseController(IExerciseService exerciseService)
        {
            _exerciseService = exerciseService;
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
        public async Task<IActionResult> GetAllExercises()
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var exercises = await _exerciseService.GetAllExercises(userId.ToString());
                return Ok(exercises);
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetExerciseById(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var exercise = await _exerciseService.GetExerciseById(id, userId.ToString());
                if (exercise == null)
                {
                    return NotFound();
                }
                return Ok(exercise);
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateExercise([FromBody] ExerciseRequest exerciseRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var exercise = new Exercise
                {
                    Name = exerciseRequest.Name,
                    Description = exerciseRequest.Description,
                    UserId = userId.ToString(), 
                    RoutineId = exerciseRequest.RoutineId
                };

                await _exerciseService.CreateExercise(exercise, exerciseRequest.CategoryId);
                return CreatedAtAction(nameof(GetExerciseById), new { id = exercise.Id }, exercise);
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExercise(int id, [FromBody] ExerciseRequest exerciseRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var existingExercise = await _exerciseService.GetExerciseById(id, userId.ToString());
                if (existingExercise == null)
                {
                    return NotFound();
                }

                existingExercise.Name = exerciseRequest.Name;
                existingExercise.Description = exerciseRequest.Description;

                await _exerciseService.UpdateExercise(existingExercise, exerciseRequest.CategoryId);
                return NoContent();
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExercise(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var exercise = await _exerciseService.GetExerciseById(id, userId.ToString());
                if (exercise == null)
                {
                    return NotFound();
                }

                await _exerciseService.DeleteExercise(id, userId.ToString());
                return NoContent();
            });
        }
    }
}