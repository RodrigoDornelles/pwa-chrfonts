import { readFile } from './readFile'
import { canvasFromChr, isRom, chrFromRom, getBanks } from './nes'
import { canvasFromPrint } from './fonts'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect: HTMLSelectElement = document.querySelector("#opt-pal-defaults") as HTMLSelectElement
    const sizeSelect: HTMLSelectElement = document.querySelector("#opt-grid-resolution") as HTMLSelectElement
    const bankSelect: HTMLSelectElement = document.querySelector("#opt-bank-chr") as HTMLSelectElement
    const sizeX: HTMLSelectElement = document.querySelector("#opt-size-x") as HTMLSelectElement
    const sizeY: HTMLSelectElement = document.querySelector("#opt-size-y") as HTMLSelectElement
    const weightInput1: HTMLInputElement = document.querySelector('#opt-weight-number') as HTMLInputElement 
    const weightInput2: HTMLInputElement = document.querySelector('#opt-weight-range') as HTMLInputElement 
    let contentBin: string;
    let contentChr: string;

    function clear() {
      const ctx = canvasOutput.getContext('2d');
      contentBin = ""
      contentChr = ""
      ctx?.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
    }

    function errorHandler(errorEvent: PromiseRejectionEvent | String | Event) {
      const reason = errorEvent instanceof PromiseRejectionEvent ? errorEvent.reason : errorEvent
      const message = reason instanceof Error? reason.message: reason
      alert(message)
      clear()
    }

    function addSizes(select: HTMLSelectElement) {
      Array.from({length: 29}, (_, px) => px + 4).forEach((px) => {
        const el = document.createElement("option") as HTMLOptionElement
        [el.value, el.text] = [`${px}`, `${px}px/${Math.ceil(px/8)}tiles`]
        el.selected = px === 8
        select.appendChild(el)
      });
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
      const fontConfig = {
        width: canvasOutput.width,
        height: canvasOutput.height,
        font: {
          width: parseInt(sizeX.value),
          height: parseInt(sizeY.value),
          weight: (256 - parseInt(weightInput1.value))
        },
        colors: [
          0x000000,
          0xFFFFFF
        ]
      }
      const contentImg = await canvasFromChr(
        contentChr,
        paleteSelect.value,
        canvasOutput.width,
        canvasOutput.height,
      )
      const contentFnt = await canvasFromPrint(fontConfig)
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
      canvasCtx?.drawImage(contentFnt, 0, 0)
    }
    function init() {
      window.onerror = errorHandler
      window.onunhandledrejection = errorHandler
      weightInput1.value = "1"
      weightInput2.value = "1"
      addSizes(sizeX)
      addSizes(sizeY)
      clear()
      bank(1)
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
    weightInput1.addEventListener('input', () => {
      weightInput2.value = weightInput1.value
      draw()
    })
    weightInput2.addEventListener('change', () => {
      weightInput1.value = weightInput2.value
      draw()
    })

    init()
});
