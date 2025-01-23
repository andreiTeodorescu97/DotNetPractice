namespace Play.Common.Settings
{
    public class MongoDbSettings
    {
        public string Host { get; init; }

        public int Port { get; init; }

        //public string ConnectionString => $"mongodb://{Host}:{Port}";
        private string connectionStringField;
        public string ConnectionString
        {
            get 
            { 
                return string.IsNullOrWhiteSpace(connectionStringField) 
                ? $"mongodb://{Host}:{Port}" : connectionStringField; 
            }
            init { connectionStringField = value; }
        }

    }
}