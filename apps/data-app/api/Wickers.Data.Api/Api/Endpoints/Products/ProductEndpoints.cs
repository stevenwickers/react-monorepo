using Wickers.data.Api.Application.Interfaces;
using Microsoft.AspNetCore.Routing;
using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Endpoints.Products;
public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/products");
        
        // READ ALL
        group.MapGet("/", async (IProductRepository repo) =>
        {
            Console.WriteLine("********************");
            var products = await repo.GetAllProducts();
            Console.WriteLine(products);
            Console.WriteLine("********************");
            return Results.Ok(products);
        })
        .WithName("GetProducts")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Read");

        // READ BY ID
        group.MapGet("/{id}", async (string id, IProductRepository repo) =>
        {
            var product = await repo.GetProductById("0101");
            return product is not null ? Results.Ok(product) : Results.NotFound();
        })
        .WithName("GetProductById")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Read");
        
        // CREATE
        group.MapPost("/", async (IProductRepository repo, Product product) =>
        {
            var newId = await repo.CreateProduct(product);
            return Results.Created($"/products/{newId}", new { Id = newId });
        })
        .WithName("CreateProduct")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Write");

        // UPDATE
        /*group.MapPut("/{id:int}", async (int id, Product product, IProductRepository repo) =>
        {
            // Safety check: ensure resource exists
            var existing = await repo.GetProductById(id);
            if (existing is null)
            {
                return Results.NotFound();
            }

            // Ensure Id from route is used (not trusting body Id)
            var updatedProduct = existing with
            {
                Name        = product.Name
            };

            var updated = await repo.UpdateAsync(updatedProduct);
            return updated is not null ? Results.Ok(updated) : Results.NotFound();
        })
        .WithName("UpdateProduct")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Write");
        */

        // DELETE
        group.MapDelete("/{id:int}", async (int id, IProductRepository repo) =>
        {
            var deleted = await repo.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteProduct")
        .WithOpenApi();
        //.RequireAuthorization("CPQ.Write");

        return group;
    }
}
