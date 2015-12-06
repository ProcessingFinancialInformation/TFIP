﻿using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Models;
using TFIP.Data.Contracts;

namespace TFIP.Business.Services
{
    public class JuridicalClientsService: IJuridicalClientsService
    {
        private readonly ICreditUow creditUow;

        public JuridicalClientsService(ICreditUow creditUow)
        {
            this.creditUow = creditUow;
        }

        long IJuridicalClientsService.IsClientExist(string identificationNo)
        {
            var client = creditUow.JuridicalClients.Get(c => c.IdentificationNo.Equals(identificationNo))
                .FirstOrDefault();
            return client != null ? client.Id : 0;
        }

        public void CreateClient(CreateJuridicalClientViewModel client)
        {
            var juridicalClient = AutoMapper.Mapper.Map<CreateJuridicalClientViewModel, JuridicalClient>(client);
            creditUow.JuridicalClients.InsertOrUpdate(juridicalClient);
            creditUow.Commit();
            client.Id = juridicalClient.Id;
        }

        public JuridicalClientInfoViewModel GetJuridicalClient(long id)
        {
            var client = creditUow.JuridicalClients.GetById(id);
            return AutoMapper.Mapper.Map<JuridicalClient, JuridicalClientInfoViewModel>(client);
        }
    }
}
