module TFIP.Web.UI.Shared {
    export class AjaxViewModel<T> {
        errors: string[];
        isValid: boolean;
        data: T;
    }

    export class ListItem {
        id: string;
        value: string;
    }

    export class TabViewModel {
        tabName: string;
        isActive: boolean;
    }
} 