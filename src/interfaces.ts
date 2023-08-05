export interface tablesInterface {
    [key: string]: { [key: number]: string }
}

export interface fontInterface {
    width: number
    height: number
    font: {
        width: number
        height: number
        weight: number
    }
    colors: Array<Number>,
    table: tablesInterface
}
