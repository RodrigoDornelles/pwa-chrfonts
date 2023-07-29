import { readFile } from './readFile'
import { canvasFromChr, isRom, chrFromRom } from './nes'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement
    const paleteSelect: HTMLSelectElement = document.querySelector("#opt-pal-defaults") as HTMLSelectElement

    async function draw() {
      const filelist: FileList = fileInput.files as FileList
      const contentBin = await readFile(filelist[0])
      const contentChr = isRom(contentBin)? chrFromRom(contentBin): contentBin
      const contentImg = await canvasFromChr(contentChr, paleteSelect.value)
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
    }

    fileInput.addEventListener('change', draw);
    paleteSelect.addEventListener('change', draw);
});
