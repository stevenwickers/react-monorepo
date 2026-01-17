using System.Data;
using System.Reflection;
using Azure.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;
using Microsoft.Data.SqlClient;
using Wickers.data.Api.Common.Extensions;
using Wickers.data.Api.Endpoints.Products;

var builder = WebApplication.CreateBuilder(args);

var keyVaultUri = builder.Configuration["KeyVault:Uri"];
if (!string.IsNullOrWhiteSpace(keyVaultUri))
{
    Console.WriteLine($"KeyVault Uri: {keyVaultUri}");
    builder.Configuration.AddAzureKeyVault(
        new Uri(keyVaultUri),
        new DefaultAzureCredential()
    );
}

builder.Services.AddScoped<IDbConnection>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var connStr = config.GetConnectionString("Sql"); // pulled from Key Vault
    return new SqlConnection(connStr);
});

builder.Services
    .AddSwaggerAuth()
    .AddInfrastructure(builder.Configuration)
    .AddCorsPolicies(builder.Configuration)
    .AddAuthServices(builder.Configuration);
    //.AddAuthentication(JwtBearerDefaults.AuthenticationScheme);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // Optional: include XML comments if you generate them
    var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("DefaultCorsPolicy");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Map endpoints
app.MapProductEndpoints();
    //.RequireAuthorization("CPQ.Read");

app.MapLookupEndpoints();
app.Run();