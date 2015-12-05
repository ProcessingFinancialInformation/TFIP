module TFIP.Web.UI.Clients {

    export class ClientType {
        individualClient = "Individual";
        juridicalPerson = "JuridicalPerson";
    }

    export enum Gender {
        Male,
        Female
    }

    export class IndividualClientFormViewModel {
        countries: Shared.ListItem[];
    }
    
    export class ClientViewModelBase {
        identificationNo: string;
        coutryId: number;
        registrationCity: string;
        registrationRegion: string;
        registrationStreet: string;
        houseNo: string;
        flatNo: string;
        registrationDate: Date | string | number;
        contactEmail: string;
        contactPhone: string;
    }

    export class ClientViewModel extends ClientViewModelBase {
        constructor() {
            super();
            this.identificationNo = "";
            this.passportNo = "";
            this.firstName = "";
            this.lastName = "";
            this.patronymic = "";
            this.gender = null;
            this.nationality = "";
            this.placeOfBirth = "";
            this.authority = "";
            this.dateOfIssue = "";
            this.dateOfExpiry = "";
            this.dateOfBirth = "";
            this.coutryId = null;
            this.registrationCity = "";
            this.registrationRegion = "";
            this.registrationStreet = "";
            this.houseNo = "";
            this.flatNo = "";
            this.registrationDate = "";
            this.contactEmail = "";
            this.contactPhone = "";
        }

        passportNo: string;
        firstName: string;
        lastName: string;
        patronymic: string;
        gender: Gender;
        nationality: string;
        placeOfBirth: string;
        authority: string;
        dateOfIssue: Date | string | number;
        dateOfExpiry: Date | string | number;
        dateOfBirth: Date | string | number;
        
    }

    export class JuridicalClientViewModel extends ClientViewModelBase {
        name: string;
        representerFirstName: string;
        representerLastName: string;
        representerPatronymic: string;
        representerPosition: string;
        pAN: string;
        registrationNumber: string;
        registrationOrganisation: string;
        checkingAccount: number;
        bankName: string;
        bankCode: number;
        zip: string;
        contactFirstName: string;
        contactLastName: string;
        contactPatronymic: string;
        contactFax: string;

        registrationDate: string | Date | number;
    }
}    