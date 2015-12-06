namespace TFIP.Common.Constants
{
    public class CreditRequestStatusConstants
    {
        public const string Draft = "Черновик";

        public const string AwaitingSecurityValidation = "Ожидание решения отдела безопасности";

        public const string AwaitingCreditCommissionValidation = "Ожидание решения кредитной комиссии";

        public const string Approved = "Одобрена";

        public const string Denied = "Отклонена";

        public const string InProgress = "В процессе выплаты";

        public const string Extinguished = "Погашен";

        public const string Overdued = "Просрочен";
    }
}
