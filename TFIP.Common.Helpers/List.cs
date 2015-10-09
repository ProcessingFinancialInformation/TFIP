using System.Collections.Generic;

namespace TFIP.Common.Helpers
{
    public static class List
    {
        public static List<T> Of<T>()
        {
            return new List<T>();
        }

        public static List<T> Of<T>(T item)
        {
            return new List<T> { item };
        }
    }
}
