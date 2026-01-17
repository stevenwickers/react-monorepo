using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Application.Interfaces;
public interface IProductRepository
{
    Task<IEnumerable<Product>> GetAllProducts();
    Task<Product?> GetProductById(string id);
    Task<int> CreateProduct(Product product);
    Task<Product?> UpdateAsync(Product product);
    Task<bool> DeleteAsync(int id);
}

