using System.Data;
using Wickers.data.Api.Domain.Entities;
using Wickers.data.Api.Infrastructure.Config;
using Wickers.data.Api.Application.Interfaces;

namespace Wickers.data.Api.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly IRepository<Product> _repo;

    // IDbConnection is injected via DI (Program.cs)
    public ProductRepository(IRepository<Product> repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<Product>> GetAllProducts()
        => await _repo.SelectAsync("dbo.usp_Product_Get");

    public async Task<Product?> GetProductById(string id)
        => await _repo.SelectByIdAsync(id, "StyleCode", "dbo.usp_Product_GetById");
    
    public async Task<int> CreateProduct(Product product)
    {
        var parameters = CreateProductParameters(product);
        parameters.Add(new Parameter 
        { 
            Name = "@NewId", 
            DataType = DbType.Int32, 
            Direction = ParameterDirection.Output 
        });
        
        var db = DynamicParameterManager.ToDynamicParameters(parameters);
        var result = await _repo.InsertAsync(db, "dbo.Products_Create");

        return result;
    }
    
    public async Task<Product?> UpdateAsync(Product product)
    {
        var parameters = CreateProductParameters(product, isUpdating: true);
        var db = DynamicParameterManager.ToDynamicParameters(parameters);
        return await _repo.UpdateAsync(db, "dbo.Products_Update");
    }

    public async Task<bool> DeleteAsync(int id)
        => await _repo.DeleteAsync(id, "dbo.Products_Delete");
    
    private static List<Parameter> CreateProductParameters(Product model, bool isUpdating = false)
    {
        var parameters = new List<Parameter>();

        /*if (isUpdating)
        {
            parameters.Add(new Parameter { Name = "@Id", DataType = DbType.Int32, Value = model.Id });
        }

        parameters.Add(new Parameter { Name = "@Name", DataType = DbType.String,  Value = model.Name });
        parameters.Add(new Parameter { Name = "@Price", DataType = DbType.Decimal, Value = model.Price });
        parameters.Add(new Parameter
        {
            Name = "@Description",
            DataType = DbType.String,
            Value = string.IsNullOrWhiteSpace(model.Description)
                ? DBNull.Value
                : model.Description
        });
        parameters.Add(new Parameter { Name = "@IsAvailable", DataType = DbType.Boolean, Value = model.IsAvailable });
        */

        return parameters;
    }
}