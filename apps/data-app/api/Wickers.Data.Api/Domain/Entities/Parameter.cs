using System.Data;

namespace Wickers.data.Api.Domain.Entities;

public class Parameter
{
    public string Name { get; set; } = default!;
    public object? Value { get; set; }
    public DbType DataType { get; set; }
    public int Size { get; set; }
    public ParameterDirection Direction { get; set; } = ParameterDirection.Input;
}
