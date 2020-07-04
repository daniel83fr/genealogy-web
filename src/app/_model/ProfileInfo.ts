interface ProfileInfo extends ProfileSummary {
    OtherNames: string[] //Separated by commas, nicknames ...
    BirthDate: Date
    BirthDateVisible: boolean

    BirthLocationCountry: string
    BirthLocationCity:string
    DeathDate: Date
    DeathLocationCountry: string
    DeathLocationCity: string
    Language: string
    CurrentLocationCity: string
    CurrentLocationCountry: string
    Email: string
    Facebook: string
    Instagram: string

}