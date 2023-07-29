import { readFile } from './readFile'
import { canvasFromChr, isRom, chrFromRom } from './nes'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect: HTMLSelectElement = document.querySelector("#opt-pal-defaults") as HTMLSelectElement
    const sizeSelect: HTMLSelectElement = document.querySelector("#opt-grid-resolution") as HTMLSelectElement

    async function draw() {
      const filelist: FileList = fileInput.files as FileList
      const contentBin = await readFile(filelist[0])
      const contentChr = isRom(contentBin)? chrFromRom(contentBin): contentBin
      const contentImg = await canvasFromChr(
        contentChr,
        paleteSelect.value,
        canvasOutput.width,
        canvasOutput.height,
      )
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
    }

    fileInput.addEventListener('change', draw);
    paleteSelect.addEventListener('change', draw);
    sizeSelect.addEventListener('change', async (e) => {
      const [width, height] = sizeSelect.value.split('x')
      canvasOutput.width = parseInt(width)
      canvasOutput.height = parseInt(height)
      await draw()
    })
});
