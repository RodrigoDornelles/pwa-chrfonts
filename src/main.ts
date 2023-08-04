import { readFile } from './readFile'
import { canvasFromChr, isRom, chrFromRom, getBanks } from './nes'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect: HTMLSelectElement = document.querySelector("#opt-pal-defaults") as HTMLSelectElement
    const sizeSelect: HTMLSelectElement = document.querySelector("#opt-grid-resolution") as HTMLSelectElement
    const bankSelect: HTMLSelectElement = document.querySelector("#opt-bank-chr") as HTMLSelectElement
    let contentBin: string;
    let contentChr: string;

    function errorHandler(errorEvent: PromiseRejectionEvent | String | Event) {
      const reason = errorEvent instanceof PromiseRejectionEvent ? errorEvent.reason : errorEvent
      const message = reason instanceof Error? reason.message: reason
      alert(message)
    }

    function bank(b: number) {
      const banksArr = Array.from({length: b}, (_, i) => i + 1).map(i => `bank ${i}`)
      Array.from(bankSelect.children).forEach(child => {
        bankSelect.removeChild(child);
      })
      banksArr.forEach((t, i) => {
        const el = document.createElement("option") as HTMLOptionElement
        [el.value, el.text] = [`${i}`, t]
        bankSelect.appendChild(el)
      });
      bankSelect.value = "0"
    }

    async function read() {
      const filelist: FileList = fileInput.files as FileList
      contentBin = await readFile(filelist[0])
      contentChr = isRom(contentBin)?
        chrFromRom(contentBin, parseInt(bankSelect.value)):
        contentBin
    }

    async function draw() {
      const contentImg = await canvasFromChr(
        contentChr,
        paleteSelect.value,
        canvasOutput.width,
        canvasOutput.height,
      )
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
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
      await read()
      bank(isRom(contentBin)? getBanks(contentBin): 1)
      await draw()
    });
    sizeSelect.addEventListener('change', async () => {
      await read()
      ;[canvasOutput.width, canvasOutput.height] = sizeSelect.value.split('x').map((size) => parseInt(size))
      await draw()
    })

    window.onerror = errorHandler
    window.onunhandledrejection = errorHandler
    bank(1)
});
