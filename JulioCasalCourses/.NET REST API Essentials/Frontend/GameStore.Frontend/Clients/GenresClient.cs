using GameStore.Frontend.Dtos;
using GameStore.Frontend.Mapping;
using GameStore.Frontend.Models;

namespace GameStore.Frontend.Clients;

public class GenresClient(HttpClient httpClient)
{
    public async Task<Genre[]> GetGenresAsync()
    {
        var games = await httpClient.GetFromJsonAsync<GenreDto[]>($"genres") ?? [];
        return games.Select(g => g.ToModel()).ToArray();
    }
}