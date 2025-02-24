using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class TokenValidationMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<TokenValidationMiddleware> _logger;
    private readonly string _secretKey;

    public TokenValidationMiddleware(RequestDelegate next, ILogger<TokenValidationMiddleware> logger, IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        _secretKey = configuration["JwtSettings:SecretKey"];
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _logger.LogInformation("TokenValidationMiddleware invoked for path: {Path}", context.Request.Path);

        var path = context.Request.Path.Value.ToLower();
        if (path == "/api/auth/login" || path == "/api/auth/register")
        {
            await _next(context);
            return;
        }

        if (context.Request.Method == HttpMethods.Options)
        {
            context.Response.StatusCode = StatusCodes.Status204NoContent;
            return;
        }

        var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

        if (token != null)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_secretKey);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidIssuer = "Workout",
                    ValidateAudience = true,
                    ValidAudience = "Workout-User",
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var claims = jwtToken.Claims.ToDictionary(c => c.Type, c => c.Value);

                context.Items["User"] = new
                {
                    Id = claims["sub"],
                    Username = claims["unique_name"],
                    Email = claims["email"]
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Token validation failed");
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return;
            }
        }
        else
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            _logger.LogError("Token validation failed");
            return;
        }

        await _next(context);
    }
}