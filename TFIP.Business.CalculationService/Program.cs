using System;

namespace TFIP.Business.CalculationService
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var calculationService = new CalculationJob();
            Console.WriteLine("Calculation Job initialized.");
            calculationService.Execute(Console.WriteLine);
            Console.WriteLine("Executing finished.");
            Console.ReadKey();
        }
    }
}
