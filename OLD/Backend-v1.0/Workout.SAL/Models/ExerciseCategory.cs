using System.ComponentModel.DataAnnotations;

namespace Workout.SAL.Models;

public class ExerciseCategory
{
    [Key]
    public int ExerciseId { get; set; }
    [Key]
    public int CategoryId { get; set; }
    public Exercise Exercise { get; set; }
    public Category Category { get; set; }
}