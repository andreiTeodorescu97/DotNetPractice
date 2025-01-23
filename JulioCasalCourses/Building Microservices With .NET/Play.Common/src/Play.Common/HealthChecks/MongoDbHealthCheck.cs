using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using MongoDB.Driver;

namespace Play.Common.HealtChecks
{
    public class MongoDbHealthCheck : IHealthCheck
    {
        private readonly MongoClient _client;

        public MongoDbHealthCheck(MongoClient client)
        {
            _client = client;
        }

        public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
        {
            try
            {
                await _client.ListDatabaseNamesAsync(cancellationToken);
                return HealthCheckResult.Healthy();
            }
            catch (System.Exception ex)
            {
                return HealthCheckResult.Unhealthy(exception: ex);
            }
        }
    }
}