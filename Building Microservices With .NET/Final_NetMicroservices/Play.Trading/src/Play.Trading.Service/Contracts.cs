using System;

namespace Play.Trading.Service.Contracts
{
    public record PurchaseRequested(
        Guid UserId,
        Guid ItemId,
        int Quantity,
        Guid CorrelationId
    );

    public record GetPurchaseState(Guid CorrelationId);
}