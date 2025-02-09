using Microsoft.AspNetCore.Mvc;
using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;

namespace Workout.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoutineController : ControllerBase
    {
        private readonly IRoutineService _routineService;

        public RoutineController(IRoutineService routineService)
        {
            _routineService = routineService;
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
        public async Task<IActionResult> GetAllRoutines()
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var routines = await _routineService.GetAllRoutines(userId.ToString());
                return Ok(routines);
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRoutineById(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var routine = await _routineService.GetRoutineById(id, userId.ToString());
                if (routine == null)
                {
                    return NotFound();
                }
                return Ok(routine);
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoutine([FromBody] RoutineRequest routineRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var routine = new Routine
                {
                    Name = routineRequest.Name,
                    Description = routineRequest.Description,
                    UserId = userId.ToString()
                };

                await _routineService.CreateRoutine(routine, routineRequest.CategoryId);
                return CreatedAtAction(nameof(GetRoutineById), new { id = routine.Id }, routine);
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRoutine(int id, [FromBody] RoutineRequest routineRequest)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                if (!ModelState.IsValid)
                {
                    return BadRequest();
                }

                var existingRoutine = await _routineService.GetRoutineById(id, userId.ToString());
                if (existingRoutine == null)
                {
                    return NotFound();
                }

                existingRoutine.Name = routineRequest.Name;
                existingRoutine.Description = routineRequest.Description;

                await _routineService.UpdateRoutine(existingRoutine, routineRequest.CategoryId);
                return NoContent();
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoutine(int id)
        {
            return await HandleUnauthorizedAccessException(async () =>
            {
                var userId = GetUserId();
                var routine = await _routineService.GetRoutineById(id, userId.ToString());
                if (routine == null)
                {
                    return NotFound();
                }

                await _routineService.DeleteRoutine(id, userId.ToString());
                return NoContent();
            });
        }
    }
}