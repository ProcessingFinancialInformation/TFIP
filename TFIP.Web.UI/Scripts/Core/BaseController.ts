module TFIP.Web.UI.Core {
    
    export class BaseController {
        

        public makeFormDirty(form: Core.ICustomFormController) {
            if (form.$error.required) {
                for (var i = 0; i < form.$error.required.length; i++) {
                    if (form.$error.required[i].fieldInput) {
                        form.$error.required[i].fieldInput.$dirty = true;
                    }
                }
            }

            if (form.$error.pattern) {
                for (var i = 0; i < form.$error.pattern.length; i++) {
                    if (form.$error.pattern[i].fieldInput) {
                        form.$error.pattern[i].fieldInput.$dirty = true;
                    }
                }
            }

            if (form.$error.max) {
                for (var i = 0; i < form.$error.max.length; i++) {
                    if (form.$error.max[i].fieldInput) {
                        form.$error.max[i].fieldInput.$dirty = true;
                    }
                }
            }

            if (form.$error.min) {
                for (var i = 0; i < form.$error.min.length; i++) {
                    if (form.$error.min[i].fieldInput) {
                        form.$error.min[i].fieldInput.$dirty = true;
                    }
                }
            }
        }
    }
} 