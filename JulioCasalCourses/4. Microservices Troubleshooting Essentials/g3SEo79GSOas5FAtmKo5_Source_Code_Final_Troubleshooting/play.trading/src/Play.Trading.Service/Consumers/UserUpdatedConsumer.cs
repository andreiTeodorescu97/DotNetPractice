using System.Threading.Tasks;
using MassTransit;
using Play.Common;
using Play.Identity.Contracts;
using Play.Trading.Service.Entities;

namespace Play.Trading.Service.Consumers
{
    public class UserUpdatedConsumer : IConsumer<UserUpdated>
    {
        private readonly IRepository<ApplicationUser> repository;

        public UserUpdatedConsumer(IRepository<ApplicationUser> repository)
        {
            this.repository = repository;
        }

        public async Task Consume(ConsumeContext<UserUpdated> context)
        {
            var message = context.Message;

            var user = await repository.GetAsync(message.UserId);

            if (user == null)
            {
                user = new ApplicationUser
                {
                    Id = message.UserId,
                    Gil = message.NewTotalGil
                };

                await repository.CreateAsync(user);
            }
            else
            {
                user.Gil = message.NewTotalGil;

                await repository.UpdateAsync(user);
            }
        }
    }
}