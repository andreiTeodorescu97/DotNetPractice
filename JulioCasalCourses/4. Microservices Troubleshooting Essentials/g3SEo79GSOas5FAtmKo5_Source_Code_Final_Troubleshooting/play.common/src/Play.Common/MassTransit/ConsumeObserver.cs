using System;
using System.Diagnostics;
using System.Threading.Tasks;
using MassTransit;
using OpenTelemetry.Trace;

namespace Play.Common.MassTransit
{
    public class ConsumeObserver : IConsumeObserver
    {
        public Task ConsumeFault<T>(ConsumeContext<T> context, Exception exception) where T : class
        {
            Activity.Current.SetStatus(Status.Error.WithDescription(exception.Message));
            return Task.CompletedTask;
        }

        public Task PostConsume<T>(ConsumeContext<T> context) where T : class
        {
            return Task.CompletedTask;
        }

        public Task PreConsume<T>(ConsumeContext<T> context) where T : class
        {
            return Task.CompletedTask;
        }
    }
}