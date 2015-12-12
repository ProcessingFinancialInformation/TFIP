using System.ComponentModel;
using TFIP.Common.Constants;

namespace TFIP.Business.Entities
{
    public enum ClientType
    {
        [Description(ClientTypeConstants.Individual)]
        Individual = 0,
        [Description(ClientTypeConstants.Juridical)]
        JuridicalPerson = 1
    }
}
