using System;
using NLog;

namespace TFIP.Common.Logging
{
    public class CommonLogger
    {
        public static void Trace(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Trace(message);
        }

        public static void Debug(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Debug(message);
        }

        public static void Info(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Info(message);
        }

        public static void Info(string format, params object[] args)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Info(string.Format(format, args));
        }

        public static void Warn(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Warn(message);
        }

        public static void Error(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Error(message);
        }

        public static void Error(string message, Exception exception)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Error(exception, message);
        }

        public static void Fatal(string message)
        {
            Logger logger = LogManager.GetLogger("commonLogger");
            logger.Fatal(message);
        }
    }
}
