// https://developer.mozilla.org/en-US/docs/Web/API/Window/queryLocalFonts
interface ExperimentalWindow extends Window {
    queryLocalFonts?: () => Promise<{ family: string }[]>;
}

export async function getSystemFonts(): Promise<string[]> {
    const defaultFonts = ['Roboto', 'Bookman', 'Comic Sans']
    const windowChromeEdge = window as ExperimentalWindow
    const availableFonts = windowChromeEdge.queryLocalFonts? await windowChromeEdge.queryLocalFonts(): []
    const familyFonts = availableFonts.length !== 0? new Set(availableFonts.map((fontData) => fontData.family)): defaultFonts

    if (availableFonts.length == 0) {
        console.warn('your browser not support queryLocalFonts()')
    }

    return Array.from(familyFonts)
}
