namespace Workout.SAL.Models;

public class Exercise
{
    public int Id { get; set; }
    public int RoutineId { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public Routine Routine { get; set; }
    public ICollection<ExerciseCategory> ExerciseCategories { get; set; } 
}