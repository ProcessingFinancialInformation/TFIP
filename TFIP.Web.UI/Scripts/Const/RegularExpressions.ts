module TFIP.Web.UI.Const {
    
    export class RegularExpressions {
        
        public lastName = /^[A-ZА-Яa-zа-я'-]+$/;
        public characters = /^[A-ZА-Яa-zа-я]+$/;
        public charactersWithSpace = /^[A-ZА-Яa-zа-я\s]+$/;

        public number = /^[\d]+$/;

        public decimalNumber = /[0-9]+([\.\,][0-9][0-9]?)?/;

        public numberWithCharacters2_14 = /^[A-Za-z0-9]{2,14}$/;

        public numberWithCharacters2_9 = /^[A-Za-z0-9]{2,9}$/;

        public zipCode = /^[A-Za-z0-9-]+$/;

        public address = /^[A-ZА-Яa-zа-я0-9\'\-\s]+$/;

        public addressNo = /^[A-ZА-Яa-zа-я0-9.'-]+$/;

        public email = /^(([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}[.](([a-zA-Z0-9]){2,63})+$/;

        public phone = /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

    }
} 