using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TFIP.Business.Entities;

namespace TFIP.Data.Contracts
{
    public interface IClientRepository<T>: IBaseRepository<T> where T: Client
    {
    }
}
