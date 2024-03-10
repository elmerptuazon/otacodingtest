export interface Note {
    title : string,
    body : string
}

export interface UnitNote extends Note {
    id : string
}

export interface Notes {
    [key : string] : UnitNote
}