using Workout.SAL.Models;

namespace Workout.SAL.Services.Interfaces;

public interface IAuthService
{
    Task<string> Login(string email, string password);
    Task<string> Register(string username, string email, string password);
    Task<User> GetUserById(string email);
}