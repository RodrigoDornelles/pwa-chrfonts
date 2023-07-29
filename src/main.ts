import { readFile } from './readFile'
import { canvasFromChr } from './canvasFromChr'

document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement
    const canvasOutput: HTMLCanvasElement = document.querySelector('#output-ppu') as HTMLCanvasElement

    fileInput.addEventListener('change', async function () {
      const filelist: FileList = fileInput.files as FileList
      const contentBin = await readFile(filelist[0])
      const contentImg = await canvasFromChr(contentBin)
      const canvasCtx = canvasOutput.getContext('2d')
      canvasCtx?.drawImage(contentImg, 0, 0)
    });
});
