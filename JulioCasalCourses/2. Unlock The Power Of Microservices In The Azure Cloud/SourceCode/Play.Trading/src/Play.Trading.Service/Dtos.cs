using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Play.Trading.Service.Dtos
{
    public record SubmitPurchaseDto(
        [Required] Guid? ItemId,
        [Range(1, 100)] int Quantity,
        [Required] Guid? IdempotencyId
    );

    public record PurchaseDto(
        Guid UserId,
        Guid ItemId,
        decimal? PurchaseTotal,
        int Quantity,
        string State,
        string Reason,
        DateTimeOffset Received,
        DateTimeOffset LastUpdated);  

    public record StoreItemDto(
        Guid Id,
        string Name,
        string Description,
        decimal Price,
        int OwnedQuantity
    );

    public record StoreDto(
        IEnumerable<StoreItemDto> Items,
        decimal UserGil
    );
}