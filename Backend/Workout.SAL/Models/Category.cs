namespace Workout.SAL.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Type { get; set; } 
    public ICollection<RoutineCategory> RoutineCategories { get; set; } 
    public ICollection<ExerciseCategory> ExerciseCategories { get; set; } 
}