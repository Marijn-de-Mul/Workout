using Workout.SAL.Services.Interfaces;
using Workout.SAL.Models;

namespace Workout.SAL.Services;

public class AuthService : IAuthService 
{
    public Task<string> Login(string email, string password)
    {
        return Task.FromResult<string>(null);
    }

    public Task<string> Register(string username, string email, string password)
    {
        return Task.FromResult<string>(null);
    }

    public Task<User> GetCurrentUser()
    {
        return Task.FromResult<User>(null);
    }
}