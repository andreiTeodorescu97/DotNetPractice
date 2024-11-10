using System;
using Play.Common;

namespace Play.Trading.Service.Entities
{
    public class ApplicationUser : IEntity
    {
        public Guid Id { get; set; }

        public decimal Gil { get; set; }
    }
}