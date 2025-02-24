using System.ComponentModel.DataAnnotations;

namespace Workout.SAL.Models;

public class RoutineCategory
{
    [Key]
    public int RoutineId { get; set; }
    [Key]
    public int CategoryId { get; set; }
    public Routine Routine { get; set; }
    public Category Category { get; set; }
}