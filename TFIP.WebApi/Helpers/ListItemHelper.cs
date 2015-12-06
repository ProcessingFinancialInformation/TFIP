using System;
using System.Collections.Generic;
using System.Linq;
using TFIP.Business.Models;
using TFIP.Common.Helpers;

namespace TFIP.Web.Api.Helpers
{
    public class ListItemHelper
    {
        public static IEnumerable<ListItem> GetFromEnum(Type enumType)
        {
            return EnumHelper.GetEnumValues(enumType)
                .Select(it => new ListItem
                {
                    Id = it.Key,
                    Value = it.Value
                });
        }
    }
}