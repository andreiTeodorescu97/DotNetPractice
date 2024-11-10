using GameStore.Frontend.Dtos;
using GameStore.Frontend.Models;

namespace GameStore.Frontend.Mapping;

public static class GameMapping
{
    public static GameSummary ToModel(this GameSummaryDto game)
    {
        return new()
        {
            Id = game.Id,
            Name = game.Name,
            Genre = game.Genre,
            Price = game.Price,
            ReleaseDate = game.ReleaseDate
        };
    }

    public static GameDetails ToModel(this GameDetailsDto game)
    {
        return new()
        {
            Id = game.Id,
            Name = game.Name,
            GenreId = game.GenreId,
            Price = game.Price,
            ReleaseDate = game.ReleaseDate
        };
    }    

    public static CreateGameDto ToCreateGameDto(this GameDetails game)
    {
        return new CreateGameDto(
            game.Name,
            game.GenreId,
            game.Price,
            game.ReleaseDate
        );
    }

    public static UpdateGameDto ToUpdateGameDto(this GameDetails game)
    {
        return new UpdateGameDto(
            game.Name,
            game.GenreId,
            game.Price,
            game.ReleaseDate
        );
    }
}
