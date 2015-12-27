module TFIP.Web.UI.Credit {
    
    export enum CreditRequestStatus {
        Draft = 0,
        AwaitingSecurityValidation = 1,
        AwaitingCreditCommissionValidation = 2,
        Denied = 31,
        InProgress = 50,
        Extinguished = 100
    }

    export class CreditTypeModel {
        name: string;
        creditKind: number;
        currency: number;
        moneyType: number;
        isIndividual: boolean;
        isGuarantorRequired: boolean;
        isDocumentsRequired: boolean;
        description: string;
        conditions: string;
        requiredDocuments: string
        termOfApplication: number
        term: number;
        rate: number;

        amountFrom: number;
        amountTo: number;

        amount: number;
        calculationType: number;
        isActive: boolean;
        id: number;
    }

    export class CreditTypePageModel {
        creditKinds: Shared.ListItem[];
    }

    export class CreditRequestModel {
        id: number;
        clientId: number;
        clientType: string;
        creditTypeId: number;
        guarantors: Clients.ClientViewModel[];
        totalAmount: number;
        status: string;
        statusId: number;
        attachments: Shared.ListItem[];
    }

} 