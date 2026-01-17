using System.Data;
using Dapper;
using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Infrastructure.Config;

public class ParameterManager
{
    public DynamicParameters CreateParameters<T>(T model)
    {
        var parameters = new DynamicParameters();

        var properties = typeof(T).GetProperties();

        foreach (var prop in properties)
        {
            var value = prop.GetValue(model);

            object sqlValue = value switch
            {
                null => DBNull.Value,
                string s when string.IsNullOrWhiteSpace(s) => DBNull.Value,
                _ => value
            };

            parameters.Add(
                $"@{prop.Name}",
                sqlValue,
                ConvertToDbType(prop.PropertyType)
            );
        }

        return parameters;
    }

    private DbType ConvertToDbType(Type type)
    {
        type = Nullable.GetUnderlyingType(type) ?? type;

        return type switch
        {
            { } t when t == typeof(int) => DbType.Int32,
            { } t when t == typeof(string) => DbType.String,
            { } t when t == typeof(bool) => DbType.Boolean,
            { } t when t == typeof(decimal) => DbType.Decimal,
            { } t when t == typeof(DateTime) => DbType.DateTime,
            _ => DbType.Object
        };
    }

    public List<Parameter> CreateIdOutParameter(List<Parameter> parameters)
    {
        parameters.Add(new Parameter() { Name = "@NewId", DataType = DbType.Int32, Direction = ParameterDirection.Output } );
        return parameters;
    }
}

        
