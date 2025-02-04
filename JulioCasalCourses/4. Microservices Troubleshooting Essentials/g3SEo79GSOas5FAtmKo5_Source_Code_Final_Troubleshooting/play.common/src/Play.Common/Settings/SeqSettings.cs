namespace Play.Common.Settings
{
    public class SeqSettings
    {
        public string Host { get; init; }
        public int Port { get; init; }

        public string ServerUrl
        {
            get { return $"http://{Host}:{Port}";}
        }
    }
}