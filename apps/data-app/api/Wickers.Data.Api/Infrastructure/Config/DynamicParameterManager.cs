using Dapper;
using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Infrastructure.Config;

public static class DynamicParameterManager
{
    public static DynamicParameters ToDynamicParameters(List<Parameter> parameters)
    {
        var dp = new DynamicParameters();

        foreach (var p in parameters)
        {
            dp.Add(
                name: p.Name,
                value: p.Value ?? DBNull.Value,
                dbType: p.DataType,
                direction: p.Direction,
                size: p.Size > 0 ? p.Size : null
            );
        }

        return dp;
    }
}
