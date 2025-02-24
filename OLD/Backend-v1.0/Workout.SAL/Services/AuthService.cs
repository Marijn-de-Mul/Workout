using Microsoft.Extensions.Logging;
using Workout.DAL.Repositories.Interfaces;
using Workout.SAL.Helpers;
using Workout.SAL.Models;
using Workout.SAL.Services.Interfaces;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _authRepository;
    private readonly TokenHelper _tokenHelper;
    private readonly EncryptionHelper _encryptionHelper;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IAuthRepository authRepository, string secretKey, ILogger<AuthService> logger)
    {
        _authRepository = authRepository;
        _tokenHelper = new TokenHelper(secretKey);
        _encryptionHelper = new EncryptionHelper();
        _logger = logger;
    }

    public async Task<string> Login(string email, string password)
    {
        var user = await _authRepository.GetUserByEmail(email);
        if (user == null)
        {
            _logger.LogWarning("User not found for email: {Email}", email);
            return null;
        }

        if (!_encryptionHelper.VerifyPassword(user.Password, password))
        {
            _logger.LogWarning("Password verification failed for user: {Email}", email);
            return null;
        }

        return _tokenHelper.GenerateToken(user.Id, user.Username, user.Email);
    }

    public async Task<string> Register(string username, string email, string password)
    {
        var existingUser = await _authRepository.GetUserByEmail(email);
        if (existingUser != null)
        {
            _logger.LogWarning("User already exists with email: {Email}", email);
            return null;
        }

        var hashedPassword = _encryptionHelper.HashPassword(password);
        var newUser = new User
        {
            Username = username,
            Email = email,
            Password = hashedPassword
        };

        await _authRepository.CreateUser(newUser);

        return _tokenHelper.GenerateToken(newUser.Id, newUser.Username, newUser.Email);
    }

    public async Task<User> GetUserById(int userId)
    {
        return await _authRepository.GetUserById(userId);
    }
}