using System.Data;
using Dapper;
using Wickers.data.Api.Domain.Entities;
using Wickers.data.Api.Application.Interfaces;
using Wickers.data.Api.Infrastructure.Config;

namespace Wickers.data.Api.Infrastructure.Repositories;

public class Repository<T> : IRepository<T>
{
    private readonly IDbConnection _db;
    private readonly ParameterManager _parameterManager;
    
    public Repository(IDbConnection db)
    {
        _db = db;
    }

    public async Task<IEnumerable<T>> SelectAsync(string storedProcedureName)
    {
        var results = await _db.QueryAsync<T>(
            storedProcedureName, 
            commandType: CommandType.StoredProcedure
        );
        
        return results;
    }

    public async Task<T> SelectByIdAsync(string id, string parameterName, string storedProcedureName)
    {
        var parameters = new DynamicParameters();
        parameters.Add(parameterName, id);

        var results = await _db.QuerySingleOrDefaultAsync<T>(
            storedProcedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return results;
    }
    
    public async Task<int> InsertAsync(DynamicParameters parameters, string storedProcedureName)
    {
        await _db.ExecuteAsync(
            storedProcedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return parameters.Get<int>("@NewId");
    }

    public async Task<T> UpdateAsync(DynamicParameters parameters, string storedProcedureName)
    {
        var result = await _db.QuerySingleOrDefaultAsync<T>(
            storedProcedureName,
            parameters,
            commandType: CommandType.StoredProcedure
        );

        return result;
    }
    
    public async Task<bool> DeleteAsync(int id, string storedProcedureName)
    {
        var affected = await _db.ExecuteAsync(
            storedProcedureName,
            new { Id = id },
            commandType: CommandType.StoredProcedure
        );

        return affected > 0;
    }
}