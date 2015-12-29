module TFIP.Web.UI.Filters {

    export function offset() {
        return function (input, start) {
            if (input) {
                start = parseInt(start, 10);
            return input.slice(start);
            }
            
        }
    }
}