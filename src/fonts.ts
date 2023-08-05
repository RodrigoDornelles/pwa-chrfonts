import { fontInterface } from "./interfaces"

export async function canvasFromPrint(cfg: fontInterface): Promise<HTMLCanvasElement> {
    const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D  
    canvas.width = cfg.width
    canvas.height = cfg.height

    ctx!.font = "8px Arial";
    ctx!.fillStyle = "white";
    ctx?.fillText("Hello World", 16, 32); 

    for (let x = 0; x < 128; x++) {
        for(let y = 0; y < 128; y++) {
            const rgba = ctx.getImageData(x, y, 1, 1).data
            if (rgba[3] > cfg.font.weight) {
                ctx.fillRect(x, y, 1, 1)
            } else if (rgba[3]) {
                ctx.clearRect(x, y, 1, 1)
            }
        }
    }

    return canvas
}
