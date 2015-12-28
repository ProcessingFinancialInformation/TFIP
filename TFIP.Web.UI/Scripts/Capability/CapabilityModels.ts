module TFIP.Web.UI.Capability {

    export class CapabilityModel {
        capabilities: ICapabilities;
    }

    export enum Capability {
        CreateCreditRequest = 1,
        ApproveCreditRequest = 2,
        MIDInformation = 3,
        NBRBInformation = 4,
        MakePayment = 5,
        CreateIndividualClient = 6,
        CreateJuridicalClient = 7,
        EditClientInfo = 8,
        ClientInformation = 254,
        AdminPermissions = 255
    }

    export interface ICapabilities {
        createCreditRequest: boolean;
        approveCreditRequest: boolean;
        midInformation: boolean;
        nbrbInformation: boolean;
        makePayment: boolean;
        createIndividualClient: boolean;
        createJuridicalClient: boolean;
        clientInformation: boolean;
        adminPermissions: boolean;
        editClientInfo: boolean;
    }
} 