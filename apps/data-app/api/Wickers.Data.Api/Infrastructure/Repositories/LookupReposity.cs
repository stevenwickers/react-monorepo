using System.Data;
using Wickers.data.Api.Domain.Entities;
using Wickers.data.Api.Infrastructure.Config;
using Wickers.data.Api.Application.Interfaces;

namespace Wickers.data.Api.Infrastructure.Repositories;

public class LookupRepository : ILookupRepository
{
    private readonly IRepository<Lookup> _repo;

    // IDbConnection is injected via DI (Program.cs)
    public LookupRepository(IRepository<Lookup> repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<Lookup>> Select()
        => await _repo.SelectAsync("dbo.usp_Lookups_GetAll");
}