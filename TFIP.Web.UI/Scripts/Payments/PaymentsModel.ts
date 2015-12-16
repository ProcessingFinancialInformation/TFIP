module TFIP.Web.UI.Payments {
    export class PaymentModelInput {
        amount: number;
        creditRequestId: number;
    }

    export class PaymentViewModel {
        id: number;
        amount: number;
        processedBy: string;
        processedAt: Date;
        creditRequestId: number;
    }

    export class BalanceInformationModel {
        mainDebtBalance: number;
        currentMonthFee: number;
    }
}