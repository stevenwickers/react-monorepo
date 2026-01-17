using Wickers.data.Api.Application.Interfaces;
using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Endpoints.Products;

public static class LookupEndpoints
{
    public static RouteGroupBuilder MapLookupEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/lookups");
        
        // READ ALL
        group.MapGet("/", async (ILookupRepository repo) =>
        {
            Console.WriteLine("********************");
            var results = await repo.Select();
            Console.WriteLine(results);
            Console.WriteLine("********************");
            return Results.Ok(results);
        })
        .WithName("GetLookups")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Read");
        
        return group;
    }
}
