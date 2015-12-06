﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TFIP.Common.Resources {
    using System;
    
    
    /// <summary>
    ///   A strongly-typed resource class, for looking up localized strings, etc.
    /// </summary>
    // This class was auto-generated by the StronglyTypedResourceBuilder
    // class via a tool like ResGen or Visual Studio.
    // To add or remove a member, edit your .ResX file then rerun ResGen
    // with the /str option, or rebuild your VS project.
    [global::System.CodeDom.Compiler.GeneratedCodeAttribute("System.Resources.Tools.StronglyTypedResourceBuilder", "4.0.0.0")]
    [global::System.Diagnostics.DebuggerNonUserCodeAttribute()]
    [global::System.Runtime.CompilerServices.CompilerGeneratedAttribute()]
    public class ErrorMessages {
        
        private static global::System.Resources.ResourceManager resourceMan;
        
        private static global::System.Globalization.CultureInfo resourceCulture;
        
        [global::System.Diagnostics.CodeAnalysis.SuppressMessageAttribute("Microsoft.Performance", "CA1811:AvoidUncalledPrivateCode")]
        internal ErrorMessages() {
        }
        
        /// <summary>
        ///   Returns the cached ResourceManager instance used by this class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Resources.ResourceManager ResourceManager {
            get {
                if (object.ReferenceEquals(resourceMan, null)) {
                    global::System.Resources.ResourceManager temp = new global::System.Resources.ResourceManager("TFIP.Common.Resources.ErrorMessages", typeof(ErrorMessages).Assembly);
                    resourceMan = temp;
                }
                return resourceMan;
            }
        }
        
        /// <summary>
        ///   Overrides the current thread's CurrentUICulture property for all
        ///   resource lookups using this strongly typed resource class.
        /// </summary>
        [global::System.ComponentModel.EditorBrowsableAttribute(global::System.ComponentModel.EditorBrowsableState.Advanced)]
        public static global::System.Globalization.CultureInfo Culture {
            get {
                return resourceCulture;
            }
            set {
                resourceCulture = value;
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиенты младше {0} лет не обслуживаются.
        /// </summary>
        public static string Adulthood {
            get {
                return ResourceManager.GetString("Adulthood", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Не указан перечень документов..
        /// </summary>
        public static string DocumentsRequired {
            get {
                return ResourceManager.GetString("DocumentsRequired", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиент с Id={0} не существует.
        /// </summary>
        public static string InvalidClientId {
            get {
                return ResourceManager.GetString("InvalidClientId", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Неверный тип клиента.
        /// </summary>
        public static string InvalidClientType {
            get {
                return ResourceManager.GetString("InvalidClientType", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Дата выдачи должна быть меньше срока действия.
        /// </summary>
        public static string InvalidIssueAndExpiryDate {
            get {
                return ResourceManager.GetString("InvalidIssueAndExpiryDate", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиенты старше {0} лет не обслуживаются.
        /// </summary>
        public static string MaxAge {
            get {
                return ResourceManager.GetString("MaxAge", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиент с идентификационным номером {0} уже существует.
        /// </summary>
        public static string UniqueIndividualClientIdentificationNumber {
            get {
                return ResourceManager.GetString("UniqueIndividualClientIdentificationNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиент с ОКПО {0} уже существует.
        /// </summary>
        public static string UniqueJuridicalClientIdentificationNumber {
            get {
                return ResourceManager.GetString("UniqueJuridicalClientIdentificationNumber", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиетн с УНП {0} уже существует.
        /// </summary>
        public static string UniquePan {
            get {
                return ResourceManager.GetString("UniquePan", resourceCulture);
            }
        }
        
        /// <summary>
        ///   Looks up a localized string similar to Клиент с регистрационным номером {0} уже существует.
        /// </summary>
        public static string UniqueRegistrationNumber {
            get {
                return ResourceManager.GetString("UniqueRegistrationNumber", resourceCulture);
            }
        }
    }
}
