using GameStore.Frontend.Dtos;
using GameStore.Frontend.Mapping;
using GameStore.Frontend.Models;
using System.Text.Json;

namespace GameStore.Frontend.Clients;

public class GamesClient(HttpClient httpClient)
{
    private readonly string[] defaultDetail = ["Unknown error."];

    public async Task<GameSummary[]> GetGamesAsync()
    {
        var games = await httpClient.GetFromJsonAsync<GameSummaryDto[]>($"games") ?? [];
        return games.Select(g => g.ToModel()).ToArray();
    }

    public async Task<GameDetails> GetGameAsync(int id)
    {
        var game = await httpClient.GetFromJsonAsync<GameDetailsDto>($"games/{id}") ?? throw new Exception("Could not find game!");
        return game.ToModel();
    }

    public async Task<FormResult> AddGameAsync(GameDetails game)
    {
        var response = await httpClient.PostAsJsonAsync("games", game.ToCreateGameDto());
        return await HandleResponseAsync(response);
    }

    public async Task<FormResult> UpdateGameAsync(GameDetails updatedGame)
    {
        var response = await httpClient.PutAsJsonAsync($"games/{updatedGame.Id}", updatedGame.ToUpdateGameDto());
        return await HandleResponseAsync(response);
    }

    public async Task DeleteGameAsync(int id)
    {
        await httpClient.DeleteAsync($"games/{id}");
    }

    private async Task<FormResult> HandleResponseAsync(HttpResponseMessage response)
    {
        if (response.IsSuccessStatusCode)
        {
            return new FormResult { Succeeded = true };
        }

        // body should contain details about why it failed
        var details = await response.Content.ReadAsStringAsync();

        var problemDetails = JsonDocument.Parse(details);
        var errors = new List<string>();
        if (problemDetails.RootElement.TryGetProperty("errors", out var errorList))
        {
            foreach (var errorEntry in errorList.EnumerateObject())
            {
                if (errorEntry.Value.ValueKind == JsonValueKind.String)
                {
                    errors.Add(errorEntry.Value.GetString()!);
                }
                else if (errorEntry.Value.ValueKind == JsonValueKind.Array)
                {
                    errors.AddRange(
                        errorEntry.Value.EnumerateArray().Select(
                            e => e.GetString() ?? string.Empty)
                        .Where(e => !string.IsNullOrEmpty(e)));
                }
            }
        }

        // return the error list
        return new FormResult
        {
            Succeeded = false,
            ErrorList = errors.Count == 0 ? defaultDetail : [.. errors]
        };
    }
}