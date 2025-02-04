using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Threading.Tasks;
using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Play.Common;
using Play.Common.Settings;
using Play.Inventory.Contracts;
using Play.Inventory.Service.Entities;
using Play.Inventory.Service.Exceptions;

namespace Play.Inventory.Service.Consumers
{
    public class GrantItemsConsumer : IConsumer<GrantItems>
    {
        private readonly IRepository<InventoryItem> inventoryItemsRepository;
        private readonly IRepository<CatalogItem> catalogItemsRepository;
        private readonly ILogger<GrantItemsConsumer> logger;
        private readonly Counter<int> counter;

        public GrantItemsConsumer(
            IRepository<InventoryItem> inventoryItemsRepository,
            IRepository<CatalogItem> catalogItemsRepository,
            ILogger<GrantItemsConsumer> logger,
            IConfiguration configuration)
        {
            this.inventoryItemsRepository = inventoryItemsRepository;
            this.catalogItemsRepository = catalogItemsRepository;
            this.logger = logger;
            var settings = configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();
            Meter meter = new(settings.ServiceName);
            counter = meter.CreateCounter<int>("ItemGranted");                        
        }

        public async Task Consume(ConsumeContext<GrantItems> context)
        {
            var message = context.Message;

            logger.LogInformation(
                "Granting {Quantity} of catalog item {CatalogItemId} to user {UserId} with CorrelationId {CorrelationId}...",
                message.Quantity,
                message.CatalogItemId,
                message.UserId,
                message.CorrelationId);

            var item = await catalogItemsRepository.GetAsync(message.CatalogItemId);

            if (item == null)
            {
                throw new UnknownItemException(message.CatalogItemId);
            }

            var inventoryItem = await inventoryItemsRepository.GetAsync(
                item => item.UserId == message.UserId && item.CatalogItemId == message.CatalogItemId);

            if (inventoryItem == null)
            {
                inventoryItem = new InventoryItem
                {
                    CatalogItemId = message.CatalogItemId,
                    UserId = message.UserId,
                    Quantity = message.Quantity,
                    AcquiredDate = DateTimeOffset.UtcNow
                };

                inventoryItem.MessageIds.Add(context.MessageId.Value);

                await inventoryItemsRepository.CreateAsync(inventoryItem);
            }
            else
            {
                if (inventoryItem.MessageIds.Contains(context.MessageId.Value))
                {
                    await context.Publish(new InventoryItemsGranted(message.CorrelationId));
                    return;
                }

                inventoryItem.Quantity += message.Quantity;
                inventoryItem.MessageIds.Add(context.MessageId.Value);
                await inventoryItemsRepository.UpdateAsync(inventoryItem);
            }

            var itemsGrantedTask = context.Publish(new InventoryItemsGranted(message.CorrelationId));
            var inventoryUpdatedTask = context.Publish(new InventoryItemUpdated(
                inventoryItem.UserId,
                inventoryItem.CatalogItemId,
                inventoryItem.Quantity
            ));

            counter.Add(1, new KeyValuePair<string, object>(nameof(item.Name), item.Name));

            await Task.WhenAll(itemsGrantedTask, inventoryUpdatedTask);
        }
    }
}