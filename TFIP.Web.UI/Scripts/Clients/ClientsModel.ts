module TFIP.Web.UI.Clients {

    export class ClientType {
        individualClient = "Individual";
        juridicalPerson = "JuridicalPerson";
    }

    export class Gender {
        male = "Male";
        female = "Female";
    }

    export class ClientViewModel {
        identificationNo: string;
        passportSeries: string;
        passportNumber: number;
        firstName: string;
        lastName: string;
        patronymic: string;
        gender: string;
        nationality: string;
        placeOfBirth: string;
        authority: string;
        dateOfIssue: Date | string | number;
        dateOfExpiry: Date | string | number;
        dateOfBirth: Date | string | number;
        registrationCountry: string;
        registrationCity: string;
        registrationRegion: string;
        houseNo: string;
        flatNo: string;
        registrationDate: Date | string | number;
    }
}    