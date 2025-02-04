using System;
using System.Threading.Tasks;
using MassTransit;
using Play.Common;
using Play.Trading.Service.Contracts;
using Play.Trading.Service.Entities;
using Play.Trading.Service.Exceptions;
using Play.Trading.Service.StateMachines;

namespace Play.Trading.Service.Activities
{
    public class CalculatePurchaseTotalActivity : IStateMachineActivity<PurchaseState, PurchaseRequested>
    {
        private readonly IRepository<CatalogItem> repository;

        public CalculatePurchaseTotalActivity(IRepository<CatalogItem> repository)
        {
            this.repository = repository;
        }

        public void Accept(StateMachineVisitor visitor)
        {
            visitor.Visit(this);
        }

        public async Task Execute(BehaviorContext<PurchaseState, PurchaseRequested> context, IBehavior<PurchaseState, PurchaseRequested> next)
        {
            var message = context.Message;

            var item = await repository.GetAsync(message.ItemId);

            if (item == null)
            {
                throw new UnknownItemException(message.ItemId);
            }

            context.Saga.PurchaseTotal = item.Price * message.Quantity;
            context.Saga.LastUpdated = DateTimeOffset.UtcNow;

            await next.Execute(context).ConfigureAwait(false);
        }

        public Task Faulted<TException>(BehaviorExceptionContext<PurchaseState, PurchaseRequested, TException> context, IBehavior<PurchaseState, PurchaseRequested> next) where TException : Exception
        {
            return next.Faulted(context);
        }

        public void Probe(ProbeContext context)
        {
            context.CreateScope("calculate-purchase-total");
        }
    }
}