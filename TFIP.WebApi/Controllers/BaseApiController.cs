using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TFIP.Business.Contracts;
using TFIP.Web.Api.Models;

namespace TFIP.Web.Api.Controllers
{
    public class BaseApiController : ApiController
    {
        public AjaxViewModel ProcessViewModel<TViewModel, TProcessFuncResult>(TViewModel viewModel, 
            IValidationService<TViewModel> validationService, Func<TViewModel, TProcessFuncResult> processFunc)
        {
            if (ModelState.IsValid)
            {
                var errors = validationService.Validate(viewModel)
                    .ToList();
                if (errors.Any())
                {
                    return CreateAjaxViewModel(viewModel, errors);
                }
                
                return CreateAjaxViewModel(processFunc(viewModel), errors);
            }

            return CreateAjaxViewModel(viewModel, ModelState.Values
                .SelectMany(it => it.Errors)
                .Select(it => it.ErrorMessage));
        }

        private AjaxViewModel CreateAjaxViewModel(object data, IEnumerable<string> errors)
        {
            return new AjaxViewModel
            {
                Data = data,
                Errors = errors.ToList()
            };
        } 
    }
}