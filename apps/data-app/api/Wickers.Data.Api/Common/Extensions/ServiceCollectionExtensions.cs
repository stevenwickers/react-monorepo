using System.Data;
using Azure.Identity;
using Microsoft.Data.SqlClient;
using Wickers.data.Api.Application.Interfaces;
using Wickers.data.Api.Infrastructure.Repositories;

namespace Wickers.data.Api.Common.Extensions;

public static partial class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, 
        IConfiguration configuration)
    {
        
        
        /*services.AddScoped<IDbConnection>(_ =>
        {
            var connectionString = configuration.GetConnectionString("SqlConnection")
                ?? throw new InvalidOperationException("Connection string 'SqlConnection' not found.");
            return new SqlConnection(connectionString);
        });*/

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ILookupRepository, LookupRepository>();
        
        return services;
    }

    public static IServiceCollection AddCorsPolicies(
        this IServiceCollection services, 
        IConfiguration config)
    {
        var allowedOrigins = config.GetSection("Cors:AllowedOrigins").Get<string[]>()
                             ?? Array.Empty<string>();
        services.AddCors(options =>
        {
            options.AddPolicy("DefaultCorsPolicy", policy =>
            {
                policy
                    .WithOrigins(allowedOrigins)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
        });
        return services;
    }
}