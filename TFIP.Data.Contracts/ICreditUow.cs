﻿using System;
using TFIP.Business.Entities;

namespace TFIP.Data.Contracts
{
    public interface ICreditUow : IDisposable
    {
        IBaseRepository<Attachment> Attachments { get; }
        IBaseRepository<AttachmentHeader> AttachmentHeaders { get; }
        IBaseRepository<Country> Countries { get; }
        ICreditRequestRepository CreditRequests { get; }
        IBaseRepository<CreditType> CreditTypes { get; }
        IClientRepository<IndividualClient> IndividualClients { get; }
        IClientRepository<JuridicalClient> JuridicalClients { get; }
        IBaseRepository<Guarantor> Guarantors { get; }
        IBaseRepository<Notification> Notifications { get; }
        IBaseRepository<Payment> Payments { get; }
        IBaseRepository<Setting> Settings { get; } 

        /// <summary>
        /// Commits info from DbContext to database
        /// </summary>
        void Commit(); 
    }
}
