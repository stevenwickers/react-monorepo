namespace Wickers.data.Api.Domain.Entities;

/*public record Product(
    int Id, 
    string Name, 
    decimal Price, 
    string? Description, 
    bool IsAvailable
);*/

/*public sealed record Product(
    string StyleCode,
    string Name,
    string Variety,
    string Brand,
    string Category,
    string ProgramType,
    bool IsAvailable,
    string Description,
    decimal Price,
    string Id
);*/

public sealed class Product
{
    public Product() {} // ✅ required

    public string StyleCode { get; set; } = "";
    public string Name { get; set; } = "";
    public string Variety { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Category { get; set; } = "";
    public string ProgramType { get; set; } = "";
}

public sealed class Lookup
{
    public Lookup() { }
    public int Id { get; set; } = -1;
    public string Name { get; set; } = "";
    public string TableName { get; set; } = "";
}


public sealed class ProductRow
{
    public string Id { get; set; } = "";
    public string StyleCode { get; set; } = "";
    public string Name { get; set; } = "";
    public string Variety { get; set; } = "";
    public string Brand { get; set; } = "";
    public string Category { get; set; } = "";
    public string ProgramType { get; set; } = "";
    public decimal Price { get; set; } = 0;
    public bool IsAvailable { get; set; } = true;
    public string Description { get; set; } = "";
}

