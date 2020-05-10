interface ProfileSummary {
    _id: string
    FirstName: string
    LastName: string
    MaidenName: string
    Gender: Gender
    YearOfBirth: Date
    YearOfDeath: Date
    IsDeceased: boolean

    ProfileType: ProfileType
}