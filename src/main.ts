import { readFile } from './readFile'
import { saveFile } from './saveFile'
import {
    canvasFromChr,
    isRom,
    chrFromRom,
    chrFromPageChr,
    getBanks,
    getPages,
    getPalette,
    chrFromCanvas,
    mergeRomAndChr,
} from './nes'
import { canvasFromPrint } from './fonts'
import { defaultTables } from './tables'
import { getSystemFonts, createName } from './util'

document.addEventListener('DOMContentLoaded', () => {
    const deactivatableElements = document.querySelectorAll('.disable') as NodeListOf<HTMLInputElement>
    const fileInput = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect = document.querySelector('#opt-pal-defaults') as HTMLSelectElement
    const sizeSelect = document.querySelector('#opt-grid-resolution') as HTMLSelectElement
    const bankSelect = document.querySelector('#opt-bank-chr') as HTMLSelectElement
    const sizeX = document.querySelector('#opt-size-x') as HTMLSelectElement
    const sizeY = document.querySelector('#opt-size-y') as HTMLSelectElement
    const fontSelect = document.querySelector('#opt-font-select') as HTMLSelectElement
    const encodeSelect = document.querySelector('#opt-encode-select') as HTMLSelectElement
    const weightInput1 = document.querySelector('#opt-weight-number') as HTMLInputElement
    const weightInput2 = document.querySelector('#opt-weight-range') as HTMLInputElement
    const downloadSelect = document.querySelector('#opt-export-format') as HTMLSelectElement
    const downloadButton = document.querySelector('#btn-export-button') as HTMLButtonElement
    let contentBin: string
    let contentChr: string

    function clear() {
        const ctx = canvasOutput.getContext('2d')
        fileInput.value = ''
        contentBin = ''
        contentChr = ''
        ctx?.clearRect(0, 0, canvasOutput.width, canvasOutput.height)
    }

    function errorHandler(errorEvent: PromiseRejectionEvent | string | Event) {
        const reason = errorEvent instanceof PromiseRejectionEvent ? errorEvent.reason : errorEvent
        const message = reason instanceof Error ? reason.message : reason
        alert(message)
        clear()
    }

    function addSizes(select: HTMLSelectElement) {
        Array.from({ length: 29 }, (_, px) => px + 4).forEach((px) => {
            const el = document.createElement('option') as HTMLOptionElement
            ;[el.value, el.text] = [`${px}`, `${px}px/${Math.ceil(px / 8)}tiles`]
            el.selected = px === 8
            select.appendChild(el)
        })
    }

    function bank(b: number) {
        const banksArr = Array.from({ length: b }, (_, i) => i + 1).map(
            (i) => `bank ${Math.ceil(i / 2)}/pattern   ${2 - (i % 2)}`,
        )
        Array.from(bankSelect.children).forEach((child) => {
            bankSelect.removeChild(child)
        })
        banksArr.forEach((t, i) => {
            const el = document.createElement('option') as HTMLOptionElement
            ;[el.value, el.text] = [`${i}`, t]
            bankSelect.appendChild(el)
        })
        bankSelect.value = '0'
    }

    async function loadLocalFonts() {
        const fonts = await getSystemFonts()
        Array.from(fontSelect.children).forEach((child) => {
            fontSelect.removeChild(child)
        })
        fonts.forEach((font) => {
            const el = document.createElement('option') as HTMLOptionElement
            ;[el.value, el.text] = [font, font]
            fontSelect.appendChild(el)
        })
        fontSelect.value = fonts[0]
    }

    async function read() {
        const filelist: FileList = fileInput.files as FileList
        contentBin = await readFile(filelist[0])
        contentChr = isRom(contentBin)
            ? chrFromRom(contentBin, parseInt(bankSelect.value))
            : chrFromPageChr(contentBin, parseInt(bankSelect.value))
    }

    async function draw() {
        const fontConfig = {
            width: canvasOutput.width,
            height: canvasOutput.height,
            table: defaultTables[encodeSelect.value],
            font: {
                family: fontSelect.value,
                width: parseInt(sizeX.value),
                height: parseInt(sizeY.value),
                weight: 255 - parseInt(weightInput1.value),
                colors: getPalette(paleteSelect.value),
            },
        }
        const contentImg = await canvasFromChr(contentChr, paleteSelect.value, canvasOutput.width, canvasOutput.height)
        const contentFnt = await canvasFromPrint(fontConfig)
        const canvasCtx = canvasOutput.getContext('2d')
        canvasCtx?.drawImage(contentImg, 0, 0)
        canvasCtx?.drawImage(contentFnt, 0, 0)
    }
    function init() {
        window.onerror = errorHandler
        window.onunhandledrejection = errorHandler
        weightInput1.value = '200'
        weightInput2.value = '200'
        addSizes(sizeX)
        addSizes(sizeY)
        clear()
        bank(1)
        deactivatableElements.forEach((el) => {
            el.disabled = true
        })
    }

    paleteSelect.addEventListener('change', async () => {
        await read()
        await draw()
    })
    bankSelect.addEventListener('change', async () => {
        await read()
        await draw()
    })
    fileInput.addEventListener('change', async () => {
        loadLocalFonts()
        bank(1)
        await read()
        bank(isRom(contentBin) ? getBanks(contentBin) : getPages(contentBin))
        await draw()
        deactivatableElements.forEach((el) => {
            el.disabled = false
        })
    })
    sizeSelect.addEventListener('change', async () => {
        await read()
        ;[canvasOutput.width, canvasOutput.height] = sizeSelect.value.split('x').map((size) => parseInt(size))
        await draw()
    })
    fontSelect.addEventListener('change', async () => {
        await draw()
    })
    encodeSelect.addEventListener('change', async () => {
        await draw()
    })
    weightInput1.addEventListener('input', async () => {
        weightInput2.value = weightInput1.value
        await draw()
    })
    weightInput2.addEventListener('change', async () => {
        weightInput1.value = weightInput2.value
        await draw()
    })
    downloadButton.addEventListener('click', () => {
        if (downloadSelect.value == 'pdf') {
            return window.print()
        }

        const bank = parseInt(bankSelect.value)
        const filelist: FileList = fileInput.files as FileList
        const extension = ['rom'].includes(downloadSelect.value) ? '' : `.${downloadSelect.value}`
        const downloadFrom = ['chr'].includes(downloadSelect.value) && isRom(contentBin) ? contentChr : contentBin
        const downloadName = createName(filelist[0].name, extension)
        const downloadContent = ['rom', 'chr'].includes(downloadSelect.value)
            ? mergeRomAndChr(downloadFrom, bank, chrFromCanvas(canvasOutput, paleteSelect.value))
            : canvasOutput

        saveFile(downloadContent, downloadName)
    })

    init()
})
