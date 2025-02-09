using Workout.SAL.Repositories.Interfaces;
using Workout.SAL.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Workout.SAL.Repositories
{
    public class RoutineRepository : IRoutineRepository
    {
        private readonly ApplicationDbContext _context;

        public RoutineRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Routine>> GetAllRoutines(string userId)
        {
            return await _context.Routines.Where(r => r.UserId == userId).ToListAsync();
        }

        public async Task<Routine> GetRoutineById(int id, string userId)
        {
            return await _context.Routines.FirstOrDefaultAsync(r => r.Id == id && r.UserId == userId);
        }

        public async Task CreateRoutine(Routine routine, int categoryId)
        {
            routine.RoutineCategories = new List<RoutineCategory> { new RoutineCategory { CategoryId = categoryId } };
            await _context.Routines.AddAsync(routine);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRoutine(Routine routine, int categoryId)
        {
            var existingRoutine = await _context.Routines.Include(r => r.RoutineCategories).FirstOrDefaultAsync(r => r.Id == routine.Id && r.UserId == routine.UserId);
            if (existingRoutine != null)
            {
                existingRoutine.Name = routine.Name;
                existingRoutine.Description = routine.Description;
                existingRoutine.RoutineCategories = new List<RoutineCategory> { new RoutineCategory { CategoryId = categoryId } };
                _context.Routines.Update(existingRoutine);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteRoutine(int id, string userId)
        {
            var routine = await GetRoutineById(id, userId);
            if (routine != null)
            {
                _context.Routines.Remove(routine);
                await _context.SaveChangesAsync();
            }
        }
    }
}