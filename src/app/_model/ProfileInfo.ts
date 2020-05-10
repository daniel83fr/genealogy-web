interface ProfileInfo extends ProfileSummary {
    OtherNames: string[] //Separated by commas, nicknames ...
    BirthDate: Date
    BirthDateVisible: boolean

    BirthLocation: string
    DeathDate: Date
    DeathLocation: string
    Language: string
    CurrentLocation: string

    Email: string
    Facebook: string
    Instagram: string

}