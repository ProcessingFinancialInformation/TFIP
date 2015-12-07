using System;
using System.Data.Entity;
using System.Diagnostics;
using System.Linq;
using TFIP.Business.Contracts;
using TFIP.Business.Entities;
using TFIP.Business.Services.CreditCalculation;
using TFIP.Common.Logging;
using TFIP.Data;
using TFIP.Data.Contracts;
using TFIP.Data.Helpers;

namespace TFIP.Business.CalculationService
{
    public class CalculationJob
    {
        private CreditDbContext dbContext;
        private IAnnuityCreditCalculationService annuityCalculationService;
        private IDifferentialCreditCalculationService differentialCalculationService;

        public void Execute()
        {
            Initialize();
            Process();
            Deinitialize();
        }

        private void Process()
        {
            var creditRequests = dbContext.CreditRequests
                .Where(it => it.Status == CreditRequestStatus.InProgress)
                .Where(it => it.NextPaymentDate.HasValue)
                .Where(it => it.NextPaymentDate == DateTime.Now.Date)
                .Include(it => it.Payments)
                .Include(it => it.CreditType);

            foreach (var creditRequest in creditRequests)
            {
                switch (creditRequest.CreditType.CalculationType)
                {
                    case CalculationType.Annuity:
                        CalculateBalance(creditRequest, annuityCalculationService);
                        break;
                    case CalculationType.Differencial:
                        CalculateBalance(creditRequest, differentialCalculationService);
                        break;
                    default:
                        CommonLogger.Error(string.Format("Unexpected Calculation Type on credit request {0}.",
                            creditRequest.Id));
                        break;

                }

                AttachForUpdate(creditRequest);
            }

            dbContext.SaveChanges();
        }

        private void CalculateBalance(CreditRequest creditRequest, ICreditCalculationService creditCalculationService)
        {
            creditRequest.CurrentBalance += creditCalculationService.CalculateCurrentMonthAmount(
                creditRequest.CreditType.Term, creditRequest.CreditType.Rate, creditRequest.TotalAmount, creditRequest.Payments);

            creditRequest.NextPaymentDate = creditRequest.NextPaymentDate.Value.AddMonths(1);
        }

        private void Initialize()
        {
            dbContext = new CreditDbContext();
            annuityCalculationService = new AnnuityCreditCalculationService();
            differentialCalculationService = new DifferentialCreditCalculationService();
        }

        private void Deinitialize()
        {
            dbContext.Dispose();
        }

        private void AttachForUpdate<T>(T entity) where T : class
        {
            if (!IsAttached(entity))
            {
                dbContext.Set<T>().Attach(entity);
            }
        }

        protected bool IsAttached<T>(T entity) where T : class
        {
            return dbContext.Set<T>().Local.Contains(entity);
        }
    }
}
