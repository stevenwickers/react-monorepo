using Microsoft.OpenApi;
using Microsoft.Extensions.DependencyInjection;

namespace Wickers.data.Api.Common.Extensions;

public static partial class ServiceCollectionExtensions
{
    public static IServiceCollection AddSwaggerAuth(this IServiceCollection services)
    {
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Wickers.data.Api",
                Version = "v1"
            });

            // 1) Define the "Bearer" scheme
            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Name = "Authorization",
                Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.Http,
                Scheme = "bearer",
                BearerFormat = "JWT"
            });

            // 2) Use the *new* AddSecurityRequirement overload
            //    that takes a document => OpenApiSecurityRequirement
            c.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                // Note: key is *OpenApiSecuritySchemeReference*, not OpenApiSecurityScheme
                [new OpenApiSecuritySchemeReference("Bearer", document)] = []
            });
        });

        return services;
    }
}