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

    export class ClientViewModel {
        identificationNo: string;
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
        coutryId: number;
        registrationCity: string;
        registrationRegion: string;
        street: string;
        houseNo: string;
        flatNo: string;
        registrationDate: Date | string | number;
        contactEmail: string;
        contactPhone: string;
    }
}    