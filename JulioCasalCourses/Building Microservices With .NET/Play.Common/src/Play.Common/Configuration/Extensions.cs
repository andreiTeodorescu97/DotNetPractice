using System;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Play.Common.Settings;

namespace Play.Common.Configuration
{
    public static class Extensions
    {
        public static IHostBuilder ConfigureAzureKeyVault(this IHostBuilder hostBuilder)
        {
            return hostBuilder.ConfigureAppConfiguration((context, configurationBuilder) =>
            {
                //add another configuration source
                if (context.HostingEnvironment.IsProduction())
                {
                    var configuration = configurationBuilder.Build();
                    var serviceSettings = configuration.GetSection(nameof(ServiceSettings)).Get<ServiceSettings>();

                    //use current identity of the running pod, we need to asign an identity that has access to connect to azure key vault, azure key vault managed identity
                    configurationBuilder.AddAzureKeyVault(new Uri($"https://{serviceSettings.KeyVaultName}.vault.azure.net/"), 
                                                        new DefaultAzureCredential());
                }
            });
        }
    }
}