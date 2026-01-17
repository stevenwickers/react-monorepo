using Wickers.data.Api.Domain.Entities;

namespace Wickers.data.Api.Application.Interfaces;

public interface ILookupRepository
{
    Task<IEnumerable<Lookup>> Select();
}