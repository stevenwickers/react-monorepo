using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;

namespace Wickers.data.Api.Common.Extensions;

/// <summary>
/// Wire up MSAL/JWT + authorization policies.
/// </summary>
public static partial class ServiceCollectionExtensions
{
    public static IServiceCollection AddAuthServices(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(configuration.GetSection("AzureAd"));

        services.AddAuthorization(options =>
        {
            options.AddPolicy("CPQ.Read", policy =>
            {
                policy.RequireAuthenticatedUser();
                // Check if scp claim CONTAINS "CPQ.Read" (handles both formats)
                policy.RequireAssertion(context =>
                {
                    // Log ALL claims to see what's available
                    Console.WriteLine("===== ALL CLAIMS =====");
                    foreach (var claim in context.User.Claims)
                    {
                        Console.WriteLine($"  {claim.Type}: {claim.Value}");
                    }
                    Console.WriteLine("======================");
                    
                    var scopeClaim = context.User.FindFirst("scp")?.Value 
                                     ?? context.User.FindFirst("scope")?.Value
                                     ?? context.User.FindFirst("http://schemas.microsoft.com/identity/claims/scope")?.Value;
                    
                    Console.WriteLine(scopeClaim);
                    return scopeClaim?.Contains("CPQ.Read") == true;
                });
            });

            options.AddPolicy("CPQ.Write", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireAssertion(context =>
                {
                    var scopeClaim = context.User.FindFirst("scp")?.Value 
                                     ?? context.User.FindFirst("scope")?.Value;
                    return scopeClaim?.Contains("CPQ.Write") == true;
                });
            });
        });
        
        services.AddAuthorization(options =>
        {
            options.AddPolicy("CPQ.Read", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scp", "CPQ.Read");
            });

            options.AddPolicy("CPQ.Write", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scp", "CPQ.Write");
            });
        });
        return services;
        
        
    }

    private static string? GetScopeClaim(AuthorizationHandlerContext context)
    {
        return context.User.FindFirst("scp")?.Value 
            ?? context.User.FindFirst("scope")?.Value
            ?? context.User.FindFirst("http://schemas.microsoft.com/identity/claims/scope")?.Value;
    }
}

        /* services.AddAuthorization(options =>
        {
            options.AddPolicy("CPQ.Read", policy =>
            {
                policy.RequireAuthenticatedUser();
                // Check if scp claim CONTAINS "CPQ.Read" (handles both formats)
                policy.RequireAssertion(context =>
                {
                    // Log ALL claims to see what's available
                    Console.WriteLine("===== ALL CLAIMS =====");
                    foreach (var claim in context.User.Claims)
                    {
                        Console.WriteLine($"  {claim.Type}: {claim.Value}");
                    }
                    Console.WriteLine("======================");
                    
                    var scopeClaim = context.User.FindFirst("scp")?.Value 
                                     ?? context.User.FindFirst("scope")?.Value
                                     ?? context.User.FindFirst("http://schemas.microsoft.com/identity/claims/scope")?.Value;
                    
                    Console.WriteLine(scopeClaim);
                    return scopeClaim?.Contains("CPQ.Read") == true;
                });
            });

            /*options.AddPolicy("CPQ.Write", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireAssertion(context =>
                {
                    var scopeClaim = context.User.FindFirst("scp")?.Value 
                                     ?? context.User.FindFirst("scope")?.Value;
                    return scopeClaim?.Contains("CPQ.Write") == true;
                });
            });*/
        //});
        
        /*services.AddAuthorization(options =>
        {
            options.AddPolicy("CPQ.Read", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scp", "CPQ.Read");
            });

            options.AddPolicy("CPQ.Write", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scp", "CPQ.Write");
            });
        });*/
        //return services; */
        
        
        
        /*services.AddAuthorization(options =>
        {
            // Policy for READ operations - accepts CPQ.Read OR CPQ.Write
            options.AddPolicy("CPQ.Read", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireAssertion(context =>
                {
                    var scopeClaim = GetScopeClaim(context);
                    return scopeClaim?.Contains("CPQ.Read") == true
                        || scopeClaim?.Contains("CPQ.Write") == true;
                });
            });

            // Policy for WRITE operations - requires CPQ.Write
            options.AddPolicy("CPQ.Write", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireAssertion(context =>
                {
                    var scopeClaim = GetScopeClaim(context);
                    return scopeClaim?.Contains("CPQ.Write") == true;
                });
            });
        });

        return services;*/