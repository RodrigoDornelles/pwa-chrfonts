// https://developer.mozilla.org/en-US/docs/Web/API/Window/queryLocalFonts
interface ExperimentalWindow extends Window {
    queryLocalFonts?: () => Promise<{ family: string }[]>
}

export async function getSystemFonts(): Promise<string[]> {
    const defaultFonts = ['Roboto', 'Bookman', 'Comic Sans']
    const windowChromeEdge = window as ExperimentalWindow
    const availableFonts = windowChromeEdge.queryLocalFonts ? await windowChromeEdge.queryLocalFonts() : []
    const familyFonts =
        availableFonts.length !== 0 ? new Set(availableFonts.map((fontData) => fontData.family)) : defaultFonts

    if (availableFonts.length == 0) {
        console.warn('your browser not support queryLocalFonts()')
    }

    return Array.from(familyFonts)
}

export function createName(filename: string, suffix: string): string {
    const chrFontSuffix = '-chrfont'
    const lastDotIndex = filename.lastIndexOf('.')
    const name = lastDotIndex !== -1 ? filename.slice(0, lastDotIndex) : filename
    const extension = lastDotIndex !== -1 ? filename.slice(lastDotIndex) : ''
    const newName = `${name}${chrFontSuffix}${extension}${suffix}`
    return newName
}
 
export function hexVecToString(arr: Array<number>, base: number, pad: number): string {
    return arr.reduce((acc, val) => acc + val.toString(base).padStart(pad, '0').toUpperCase(), '')
}
