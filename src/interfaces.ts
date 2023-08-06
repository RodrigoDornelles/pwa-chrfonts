export interface tablesInterface {
    [key: string]: { [key: number]: string }
}

export interface fontInterface {
    width: number
    height: number
    weight: number
    family: string
    colors: Array<string>
}

export interface printInterface {
    width: number
    height: number
    font: fontInterface
    table: tablesInterface
}
