import { readFile } from './readFile'
import { canvasFromChr, isRom, chrFromRom, getBanks } from './nes'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect: HTMLSelectElement = document.querySelector("#opt-pal-defaults") as HTMLSelectElement
    const sizeSelect: HTMLSelectElement = document.querySelector("#opt-grid-resolution") as HTMLSelectElement
    const bankSelect: HTMLInputElement = document.querySelector("#opt-bank-chr") as HTMLInputElement

    async function draw() {
      const filelist: FileList = fileInput.files as FileList
      const contentBin = await readFile(filelist[0])
      let contentChr: string = contentBin

      if (isRom(contentBin)) {
        contentChr = chrFromRom(contentBin, parseInt(bankSelect.value))
        bankSelect.max = `${getBanks(contentBin)}`
      }
      const contentImg = await canvasFromChr(
        contentChr,
        paleteSelect.value,
        canvasOutput.width,
        canvasOutput.height,
      )
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
    }

    paleteSelect.addEventListener('change', draw)
    bankSelect.addEventListener('change', draw)
    fileInput.addEventListener('change', async () => {
      bankSelect.max = "1"
      bankSelect.value = "1"
      await draw()
    });
    sizeSelect.addEventListener('change', async () => {
      [canvasOutput.width, canvasOutput.height] = sizeSelect.value.split('x').map((size) => parseInt(size))
      await draw()
    })
});
