using GameStore.Frontend.Dtos;
using GameStore.Frontend.Models;

namespace GameStore.Frontend.Mapping;

public static class GenreMapping
{
    public static Genre ToModel(this GenreDto game)
    {
        return new()
        {
            Id = game.Id,
            Name = game.Name
        };
    }
}
