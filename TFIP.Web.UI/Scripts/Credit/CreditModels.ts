module TFIP.Web.UI.Credit {
    
    export class CreditTypeModelBase {
        
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
        amount: number;
        calculationType: number;
        isActive: boolean;
    }

    export class CreditTypePageModel {
        creditKinds: Shared.ListItem[];
    }

} 