using Workout.SAL.Repositories.Interfaces;
using Workout.SAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Workout.SAL.Repositories
{
    public class ExerciseRepository : IExerciseRepository
    {
        private readonly ApplicationDbContext _context;

        public ExerciseRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Exercise>> GetAllExercises(string userId)
        {
            return await _context.Exercises.Where(e => e.UserId == userId).ToListAsync();
        }

        public async Task<Exercise> GetExerciseById(int id, string userId)
        {
            return await _context.Exercises.FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);
        }

        public async Task CreateExercise(Exercise exercise, int categoryId)
        {
            // Log the RoutineId for debugging
            Console.WriteLine($"RoutineId: {exercise.RoutineId}");

            // Check if the RoutineId exists
            var routineExists = await _context.Routines.AnyAsync(r => r.Id == exercise.RoutineId);
            if (!routineExists)
            {
                throw new InvalidOperationException("The specified RoutineId does not exist.");
            }

            exercise.ExerciseCategories = new List<ExerciseCategory>
                { new ExerciseCategory { CategoryId = categoryId } };
            await _context.Exercises.AddAsync(exercise);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateExercise(Exercise exercise, int categoryId)
        {
            var routineExists = await _context.Routines.AnyAsync(r => r.Id == exercise.RoutineId);
            if (!routineExists)
            {
                throw new InvalidOperationException("The specified RoutineId does not exist.");
            }

            var existingExercise = await _context.Exercises.Include(e => e.ExerciseCategories).FirstOrDefaultAsync(e => e.Id == exercise.Id && e.UserId == exercise.UserId);
            if (existingExercise != null)
            {
                existingExercise.Name = exercise.Name;
                existingExercise.Description = exercise.Description;
                existingExercise.ExerciseCategories = new List<ExerciseCategory> { new ExerciseCategory { CategoryId = categoryId } };
                _context.Exercises.Update(existingExercise);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteExercise(int id, string userId)
        {
            var exercise = await GetExerciseById(id, userId);
            if (exercise != null)
            {
                _context.Exercises.Remove(exercise);
                await _context.SaveChangesAsync();
            }
        }
    }
}