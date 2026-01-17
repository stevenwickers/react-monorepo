using Dapper;

namespace Wickers.data.Api.Application.Interfaces;

public interface IRepository<T>
{
    Task<IEnumerable<T>> SelectAsync(string storedProcedureName);
    Task<T> SelectByIdAsync(string id, string parameterName, string storedProcedureName);
    Task<int> InsertAsync(DynamicParameters parameters, string storedProcedureName);
    Task<T> UpdateAsync(DynamicParameters parameters, string storedProcedureName);
    Task<bool> DeleteAsync(int id, string storedProcedureName);
}